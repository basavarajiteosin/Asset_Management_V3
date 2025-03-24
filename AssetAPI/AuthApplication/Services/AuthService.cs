using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AssetAuthApplication.DbContexts;
using AuthApplication.DbContexts;
using AuthApplication.Helpers;
using AuthApplication.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AuthApplication.Services
{
    public class AuthService
    {
        private readonly IConfiguration _configuration;
        private readonly AuthAppContext _dbContext;
        private readonly MainDbContext _mainDbContext;


        public AuthService(IConfiguration configuration, AuthAppContext dbContext, MainDbContext mainDbContext)
        {
            _configuration = configuration;
            _dbContext = dbContext;
            _mainDbContext = mainDbContext;

        }


        public Client FindClient(string clientId)
        {
            try
            {
                var client = _dbContext.Clients.Find(clientId);
                return client;
            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("AuthRepository/FindClient : - ", ex);
                return null;
            }
        }


        public async Task<LoginResult> LoginUser(string UserName, string Password)
        {
            try
            {
                string userId = string.Empty, role = string.Empty;
                List<App> MenuItemList = new List<App>();
                string MenuItemNames = "";
                User user = null;
                var active = false;
                string isChangePasswordRequired = "No";
                string DefaultPassword = _configuration.GetValue<string>("DefaultPassword");

                // Find user by Email or Username
                if (UserName.Contains('@') && UserName.Contains('.'))
                {
                    user = _mainDbContext.Users.FirstOrDefault(tb => tb.Email == UserName);
                }
                else
                {
                    user = _mainDbContext.Users.FirstOrDefault(tb => tb.UserName == UserName);
                }

                if (user != null)
                {
                    if (!user.IsActive)
                    {
                        throw new Exception("Sorry, Your account is blocked by admin. You cannot access this account anymore. Please contact the admin.");
                    }

                    bool isValidUser = false;
                    var loginResult = new LoginResult();
                    string DecryptedPassword = Decrypt(user.Password, true);
                    isValidUser = DecryptedPassword == Password;

                    if (isValidUser)
                    {
                        if (!user.IsLocked || (user.IsLocked && DateTime.Now >= user.IsLockDuration))
                        {
                            user.IsLocked = false;
                            user.Attempts = 0;
                            GC.Collect();
                            GC.WaitForPendingFinalizers();

                            // Check if password reset is required
                            if (user.Pass1 == null)
                            {
                                isChangePasswordRequired = "Yes";
                                loginResult.ReasonForReset = "Please Enter a New Password to login.";
                            }
                            if (user.ExpiryDate != null && DateTime.Now > user.ExpiryDate)
                            {
                                isChangePasswordRequired = "Yes";
                                loginResult.ReasonForReset = "Your Password has expired. Please enter a new password to login.";
                            }

                            // Fetch role mapping for the user
                            var userRoleMap = _dbContext.UserRoleMaps.FirstOrDefault(ur => ur.UserID == user.UserID && ur.IsActive);

                            // If no role is assigned, throw an error
                            if (userRoleMap == null)
                            {
                                throw new Exception("You don't have Access to this site. Please contact the admin for login access.");
                            }

                            // Fetch user role
                            var userRole = _dbContext.Roles.FirstOrDefault(r => r.RoleID == userRoleMap.RoleID && r.IsActive);


                            // Fetch menu items based on role
                            if (userRole != null)
                            {
                                MenuItemList = _dbContext.Apps
                                    .Join(_dbContext.RoleAppMaps, app => app.AppID, map => map.AppID, (app, map) => new { app, map })
                                    .Where(j => j.map.RoleID == userRole.RoleID && j.app.IsActive && j.map.IsActive)
                                    .Select(j => j.app)
                                    .ToList();
                            }

                            // Prepare login response
                            loginResult.UserID = user.UserID;
                            loginResult.UserName = user.UserName;
                            loginResult.DisplayName = user.UserName;
                            loginResult.EmailAddress = user.Email;
                            loginResult.FirstName = user?.FirstName ?? "";
                            loginResult.LastName = user?.LastName ?? "";
                            loginResult.ProfilePic = user.PicDbPath;
                            loginResult.AccountGroup = user.AccountGroup ?? "";
                            loginResult.UserRole = userRole?.RoleName ?? "";
                            loginResult.IsChangePasswordRequired = isChangePasswordRequired;
                            loginResult.menuItemNames = MenuItemList;

                            await _dbContext.SaveChangesAsync();
                            await AddLoginHistory(user.UserID, user.UserName);

                            return loginResult;
                        }
                        else
                        {
                            throw new Exception("Your account has been locked due to incorrect password attempts. Please try again after 15 minutes.");
                        }
                    }
                    else
                    {
                        user.Attempts++;
                        string reason = "The username or password is incorrect.";
                        if (user.Attempts == 5)
                        {
                            user.IsLocked = true;
                            reason = "Your account has been locked due to multiple incorrect password attempts. Please try again after 15 minutes.";
                            user.IsLockDuration = DateTime.Now.AddMinutes(15);
                        }
                        await _dbContext.SaveChangesAsync();
                        throw new Exception(reason);
                    }
                }
                else
                {
                    throw new Exception("The username or password is incorrect.");
                }
            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("AuthorizationServerProvider/GrantResourceOwnerCredentials :- ", ex);
                throw ex;
            }
        }


        public async Task AddLoginHistory(Guid userID, string username)
        {
            try
            {
                var loginData = new UserLoginHistory
                {
                    UserID = userID,
                    UserName = username,
                    LoginTime = DateTime.Now
                };

                _dbContext.UserLoginHistory.Add(loginData);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the app", ex);
            }
        }

        private string Decrypt(string Password, bool UseHashing)
        {
            try
            {
                string EncryptionKey = "Iteos";
                byte[] KeyArray;
                byte[] ToEncryptArray = Convert.FromBase64String(Password);
                if (UseHashing)
                {
                    using (MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider())
                    {
                        KeyArray = hashmd5.ComputeHash(Encoding.UTF8.GetBytes(EncryptionKey));
                    }
                }
                else
                {
                    KeyArray = Encoding.UTF8.GetBytes(EncryptionKey);
                }

                using (TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider())
                {
                    tdes.Key = KeyArray;
                    tdes.Mode = CipherMode.ECB;
                    tdes.Padding = PaddingMode.PKCS7;
                    ICryptoTransform cTransform = tdes.CreateDecryptor();
                    byte[] resultArray = cTransform.TransformFinalBlock(ToEncryptArray, 0, ToEncryptArray.Length);
                    return Encoding.UTF8.GetString(resultArray);
                }
            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("AuthorizationServerProvider/Decrypt :- ", ex);
                return null;
            }
        }

    }
}

