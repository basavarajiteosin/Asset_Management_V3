using System;
using System.Data;
using System.Net.Mail;
using System.Reflection.Metadata.Ecma335;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using AssetAuthApplication.DbContexts;
using AuthApplication.DbContexts;
using AuthApplication.Helpers;
using AuthApplication.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthApplication.Services
{
    public class AuthMasterServices
    {
        private readonly IConfiguration _configuration;
        private readonly AuthAppContext _dbContext;
        private readonly EmailService _emailService;
        private readonly SMSService _smsService;
        private readonly MainDbContext _mainDbContext;

        private readonly int _tokenTimespan;

        public AuthMasterServices(IConfiguration configuration, AuthAppContext dbContext, EmailService emailService, SMSService smsService, MainDbContext mainDbContext)
        {
            _configuration = configuration;
            _dbContext = dbContext;
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
            _smsService = smsService ?? throw new ArgumentNullException(nameof(smsService));
            try
            {
                var span = "30";
                if (span != "")
                    _tokenTimespan = Convert.ToInt32(span.ToString());
                if (_tokenTimespan <= 0)
                {
                    _tokenTimespan = 30;
                }
            }
            catch
            {
                _tokenTimespan = 30;
            }

            _mainDbContext = mainDbContext;
        }

        #region Authentication

        public Client FindClient(string clientId)
        {
            try
            {
                var client = _dbContext.Clients.Find(clientId);
                return client;
            }
            catch (Exception ex)
            {
                // Handle exceptions here or let them bubble up
                throw new Exception(ex.Message ?? "Network Error");
            }
        }


        #endregion

        #region Encrypt&DecryptFuction

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


        private string Encrypt(string Password, bool useHashing)
        {
            try
            {
                string EncryptionKey = "Iteos";
                byte[] KeyArray;
                byte[] ToEncryptArray = Encoding.UTF8.GetBytes(Password);
                if (useHashing)
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
                    ICryptoTransform cTransform = tdes.CreateEncryptor();
                    byte[] resultArray = cTransform.TransformFinalBlock(ToEncryptArray, 0, ToEncryptArray.Length);
                    return Convert.ToBase64String(resultArray, 0, resultArray.Length);
                }
            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("AuthorizationServerProvider/Encrypt :- ", ex);
                return null;
            }
        }

        #endregion

        #region UserCreation


        //public List<UserWithRole> GetAllUsers(string ClientId)
        //{
        //    try
        //    {
        //        // Validate if ClientId exists
        //        var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == ClientId);
        //        if (clientcheck == null)
        //        {
        //            throw new Exception("ClientId does not exist.");
        //        }

        //        // Fetch Users from MainDbContext
        //        var users = _mainDbContext.Users
        //            .Where(tb => tb.ClientId == ClientId)
        //            .OrderByDescending(tb => tb.CreatedOn)
        //            .ToList();

        //        // Fetch UserRoleMaps from AuthDbContext
        //        var userRoleMaps = _dbContext.UserRoleMaps.Where(tb1 => tb1.IsActive).ToList();

        //        // Fetch Roles from AuthDbContext
        //        var roles = _dbContext.Roles.ToList();

        //        // Fetch Employee Info from MainDbContext
        //        var empInfos = _mainDbContext.EmpInfos.ToList();

        //        // Perform in-memory join
        //        var result = (from tb in users
        //                      join tb1 in userRoleMaps on tb.UserID equals tb1.UserID
        //                      join tb2 in roles on tb1.RoleID equals tb2.RoleID
        //                      join tb3 in empInfos on tb.UserID equals tb3.EmpId
        //                      select new UserWithRole
        //                      {
        //                          UserID = tb.UserID,
        //                          UserName = tb.UserName,
        //                          Email = tb.Email,
        //                          ContactNumber = tb.ContactNumber,
        //                          Password = Decrypt(tb.Password, true),
        //                          IsActive = tb.IsActive,
        //                          RoleName = tb2.RoleName,
        //                          CreatedOn = tb.CreatedOn,
        //                          ModifiedOn = tb.ModifiedOn,
        //                          RoleID = tb1.RoleID,
        //                          AccountGroup = tb.AccountGroup,
        //                          ClientId = tb.ClientId,
        //                          FirstName = tb3.FirstName,
        //                          LastName = tb3.LastName,
        //                          Address = tb3.Address,
        //                          DateOfBirth = tb3.DateOfBirth,
        //                          JoiningDate = tb3.JoiningDate
        //                      }).ToList();

        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception(ex.Message ?? "Network Error");
        //    }
        //}

        public List<UserWithRole> GetAllUsers(string ClientId)
        {
            try
            {
                // Validate if ClientId exists
                var clientCheck = _dbContext.Clients.FirstOrDefault(e => e.Id == ClientId);
                if (clientCheck == null)
                {
                    throw new Exception("ClientId does not exist.");
                }

                // Fetch Users from MainDbContext
                var users = _mainDbContext.Users
                    .Where(tb => tb.ClientId == ClientId)
                    .OrderByDescending(tb => tb.CreatedOn)
                    .ToList();

                // Fetch UserRoleMaps from AuthDbContext
                var userRoleMaps = _dbContext.UserRoleMaps.Where(tb1 => tb1.IsActive).ToList();

                // Fetch Roles from AuthDbContext
                var roles = _dbContext.Roles.ToList();

                // Perform LEFT JOIN to ensure all users are included
                var result = (from user in users
                              join roleMap in userRoleMaps on user.UserID equals roleMap.UserID into userRoleGroup
                              from userRole in userRoleGroup.DefaultIfEmpty()  // Left join to include users without roles
                              join role in roles on userRole?.RoleID equals role.RoleID into roleGroup
                              from roleData in roleGroup.DefaultIfEmpty()  // Left join to include users without roles
                              select new UserWithRole
                              {
                                  UserID = user.UserID,
                                  UserName = user.UserName,
                                  Email = user.Email,
                                  ContactNumber = user.ContactNumber,
                                  Password = Decrypt(user.Password, true),
                                  IsActive = user.IsActive,
                                  RoleName = roleData != null ? roleData.RoleName : "No Role Assigned",
                                  CreatedOn = user.CreatedOn,
                                  ModifiedOn = user.ModifiedOn,
                                  RoleID = userRole?.RoleID ?? Guid.Empty, // If no role, assign empty GUID
                                  AccountGroup = user.AccountGroup,
                                  ClientId = user.ClientId,
                                  FirstName = user?.FirstName ?? "",
                                  LastName = user?.LastName ?? "",
                                  Address = user?.Address ?? "",
                                  DateOfBirth = user?.DateOfBirth,
                                  JoiningDate = user?.JoiningDate
                              }).ToList();

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }


        public List<UserWithRole> GetAllAccessUsers(string ClientId)
        {
            try
            {
                // Validate if ClientId exists
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId does not exist.");
                }

                // Fetch Users from MainDbContext
                var users = _mainDbContext.Users
                    .Where(tb => tb.ClientId == ClientId)
                    .OrderByDescending(tb => tb.CreatedOn)
                    .ToList();

                // Fetch UserRoleMaps from AuthDbContext
                var userRoleMaps = _dbContext.UserRoleMaps.Where(tb1 => tb1.IsActive).ToList();

                // Fetch Roles from AuthDbContext
                var roles = _dbContext.Roles.ToList();
                // Perform in-memory join
                var result = (from tb in users
                              join tb1 in userRoleMaps on tb.UserID equals tb1.UserID
                              join tb2 in roles on tb1.RoleID equals tb2.RoleID
                              select new UserWithRole
                              {
                                  UserID = tb.UserID,
                                  UserName = tb.UserName,
                                  Email = tb.Email,
                                  ContactNumber = tb.ContactNumber,
                                  //Password = Decrypt(tb.Password, true),
                                  IsActive = tb.IsActive,
                                  RoleName = tb2.RoleName,
                                  CreatedOn = tb.CreatedOn,
                                  ModifiedOn = tb.ModifiedOn,
                                  RoleID = tb1.RoleID,
                                  AccountGroup = tb.AccountGroup,
                                  ClientId = tb.ClientId,
                                  FirstName = tb.FirstName,
                                  LastName = tb.LastName,
                                  Address = tb.Address,
                                  DateOfBirth = tb.DateOfBirth,
                                  JoiningDate = tb.JoiningDate
                              }).ToList();

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }



        public async Task<User> GetEmpInfoById(Guid id)
        {
            try
            {
                var empInfo = await _mainDbContext.Users.FindAsync(id);
                if (empInfo == null)
                {
                    throw new Exception("Employee not found!");
                }

                return empInfo;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<User> UpdateFromEmployeeEmpInfo(FromEmployeeEmpInfo empInfo)
        {
            try
            {
                var existingEmp = await _mainDbContext.Users.FindAsync(empInfo.EmpId);
                if (existingEmp == null)
                {
                    throw new Exception("User Not Found");
                }

                existingEmp.FirstName = empInfo.FirstName;
                existingEmp.LastName = empInfo.LastName;
                existingEmp.Address = empInfo.Address;
                existingEmp.ContactNumber = empInfo.contactNumber;
                existingEmp.DateOfBirth = empInfo.DateOfBirth;
                existingEmp.ModifiedBy = empInfo.ModifiedBy;
                existingEmp.ModifiedOn = DateTime.Now;


                await _mainDbContext.SaveChangesAsync();
                return existingEmp;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<UserWithRole> CreateUser(UserWithRole userWithRole)
        {
            using var transactionMainDb = await _mainDbContext.Database.BeginTransactionAsync();
            using var transactionDb = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                // Check if client exists
                var clientCheck = await _dbContext.Clients.FirstOrDefaultAsync(e => e.Id == userWithRole.ClientId);
                if (clientCheck == null)
                {
                    throw new Exception("ClientId does not exist.");
                }

                string portalAddress = _configuration["SiteURL"];

                // Check if the user with the same username already exists in _mainDbContext
                if (await _mainDbContext.Users.AnyAsync(u => u.UserName == userWithRole.UserName && u.IsActive))
                {
                    throw new Exception("User with the same username already exists.");
                }

                // Check if the user with the same email already exists in _mainDbContext
                if (await _mainDbContext.Users.AnyAsync(u => u.Email == userWithRole.Email))
                {
                    throw new Exception("User with the same email address already exists.");
                }

                string filePath = null;
                string dbFilePath = null;

                if (userWithRole.ProfilePic != null)
                {
                    string folderPath = _configuration["FolderPath"];
                    string folderName = "/ProfileAttachemants/";
                    string portalAddressLink = _configuration["ApiURL"];

                    // Save profile picture
                    var fileName = $"{Guid.NewGuid()}_{userWithRole.ProfilePic.FileName.Replace(" ", "_")}";
                    filePath = Path.Combine(folderPath, fileName);
                    dbFilePath = portalAddressLink + Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await userWithRole.ProfilePic.CopyToAsync(stream);
                    }
                }

                // Creating User in _mainDbContext
                var user = new User
                {
                    UserID = Guid.NewGuid(),
                    UserName = userWithRole.UserName,
                    Email = userWithRole.Email,
                    Password = Encrypt(userWithRole.Password, true),
                    AccountGroup = userWithRole.AccountGroup,
                    ContactNumber = userWithRole.ContactNumber,
                    FirstName = userWithRole.FirstName,
                    LastName = userWithRole.LastName,
                    Address = userWithRole.Address,
                    DateOfBirth = userWithRole.DateOfBirth,
                    JoiningDate = userWithRole.JoiningDate,
                    Department = userWithRole.AccountGroup,
                    Plant = "Bangalore",
                    ClientId = userWithRole.ClientId,
                    CreatedBy = userWithRole.CreatedBy,
                    IsActive = true,
                    CreatedOn = DateTime.Now,
                    IsLocked = false,
                    Attempts = 0,
                    ExpiryDate = DateTime.Now.AddDays(90),
                    ProfilePath = filePath,
                    PicDbPath = dbFilePath
                };
                await _mainDbContext.Users.AddAsync(user);
                await _mainDbContext.SaveChangesAsync();

                var message1 = $"User ID {user.UserID} added successfully.";

                if (!string.IsNullOrEmpty(userWithRole.CreatedBy))
                {
                    UsersCreationOrUpdateLog(Guid.Parse(userWithRole.CreatedBy), message1);
                }


                // Creating User Role Mapping in _dbContext
                var userRole = new UserRoleMap
                {
                    RoleID = userWithRole.RoleID,
                    UserID = user.UserID,
                    IsActive = true,
                    CreatedOn = DateTime.Now
                };
                await _dbContext.UserRoleMaps.AddAsync(userRole);
                await _dbContext.SaveChangesAsync();

                var message2 = $"User ID {user.UserID} assigned Role ID {userWithRole.RoleID} successfully.";

                if (!string.IsNullOrEmpty(userWithRole.CreatedBy))
                {
                    UsersCreationOrUpdateLog(Guid.Parse(userWithRole.CreatedBy), message2);
                }

                // Committing Transactions
                await transactionMainDb.CommitAsync();
                await transactionDb.CommitAsync();

                // Preparing response
                var userResult = new UserWithRole
                {
                    UserID = user.UserID,
                    UserName = user.UserName,
                    Email = user.Email,
                    ContactNumber = user.ContactNumber,
                    Password = user.Password,
                    RoleID = userRole.RoleID
                };

                // Send initialization email
                var emailResult = await _emailService.SendInitializationMail(
                    userWithRole.FirstName,
                    userWithRole.LastName,
                    userResult.Email,
                    Decrypt(userResult.Password, true),
                    portalAddress
                );

                if (!emailResult)
                {
                    throw new Exception("Failed to send email.");
                }

                return userResult;
            }
            catch (Exception ex)
            {
                await transactionMainDb.RollbackAsync(); // Rollback in case of error
                await transactionDb.RollbackAsync();
                throw new Exception(ex.Message ?? "Network Error");
            }
        }




        public async Task<string> ProfileUpdateUser(UserProfileUpdate userProfileUpdate)
        {
            try
            {
                // Fetch user from _dbContext.Users
                var user = await _mainDbContext.Users.FirstOrDefaultAsync(u => u.UserID == userProfileUpdate.UserID && u.IsActive);
                if (user == null)
                {
                    throw new Exception("User does not exist or is not active.");
                }

                string newFilePath = null;
                string newDbFilePath = null;

                if (userProfileUpdate.ProfilePic != null)
                {
                    // Delete old profile picture if it exists
                    if (!string.IsNullOrEmpty(user.ProfilePath) && File.Exists(user.ProfilePath))
                    {
                        File.Delete(user.ProfilePath);
                    }

                    // Save new profile picture
                    string folderPath = _configuration["FolderPath"];
                    string folderName = "/ProfileAttachemants/";
                    string portalAddressLink = _configuration["ApiURL"];
                    string fileName = $"{Guid.NewGuid()}_{userProfileUpdate.ProfilePic.FileName.Replace(" ", "_")}";

                    newFilePath = Path.Combine(folderPath, fileName);
                    newDbFilePath = portalAddressLink + Path.Combine(folderName, fileName);


                    using (var stream = new FileStream(newFilePath, FileMode.Create))
                    {
                        await userProfileUpdate.ProfilePic.CopyToAsync(stream);
                    }

                    // Update profile paths in Users table
                    user.ProfilePath = newFilePath;
                    user.PicDbPath = newDbFilePath;
                    user.ModifiedOn = DateTime.Now;
                    user.ModifiedBy = userProfileUpdate.ModifiedBy;
                }

                // Logging
                var message = $"User ID {userProfileUpdate.UserID} profile updated. Old: {user.ProfilePath}, New: {newDbFilePath}";

                if (!string.IsNullOrEmpty(userProfileUpdate.ModifiedBy))
                {
                    UsersCreationOrUpdateLog(Guid.Parse(userProfileUpdate.ModifiedBy), message);
                }

                await _mainDbContext.SaveChangesAsync();

                return newDbFilePath ?? "No new profile picture uploaded.";
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }


        public async Task<UserWithRole> UpdateUser(UserWithRole userWithRole)
        {
            using var transactionMainDb = await _mainDbContext.Database.BeginTransactionAsync();
            using var transactionDb = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var clientCheck = await _dbContext.Clients.FirstOrDefaultAsync(e => e.Id == userWithRole.ClientId);
                if (clientCheck == null)
                {
                    throw new Exception("ClientId does not exist");
                }

                // Check if username or email is already taken
                if (await _mainDbContext.Users.AnyAsync(u => u.UserName == userWithRole.UserName && u.UserID != userWithRole.UserID))
                {
                    throw new Exception("User with the same name already exists");
                }
                if (await _mainDbContext.Users.AnyAsync(u => u.Email == userWithRole.Email && u.UserID != userWithRole.UserID))
                {
                    throw new Exception("User with the same email address already exists");
                }

                // Fetch existing user from _mainDbContext
                var user = await _mainDbContext.Users.FirstOrDefaultAsync(tb => tb.UserID == userWithRole.UserID);
                if (user == null)
                {
                    throw new Exception("User not found");
                }

                List<string> updatedFields = new List<string>();

                void UpdateField<T>(string fieldName, T existingValue, T newValue, Action<T> updateAction)
                {
                    if (!EqualityComparer<T>.Default.Equals(existingValue, newValue))
                    {
                        updateAction(newValue);
                        updatedFields.Add($"{fieldName}: '{existingValue}' -> '{newValue}'");
                    }
                }

                UpdateField("UserName", user.UserName, userWithRole.UserName, val => user.UserName = val);
                UpdateField("Email", user.Email, userWithRole.Email, val => user.Email = val);
                UpdateField("Address", user.Address, userWithRole.Address, val => user.Address = val);
                UpdateField("DateOfBirth", user.DateOfBirth, userWithRole.DateOfBirth, val => user.DateOfBirth = val);
                UpdateField("FirstName", user.FirstName, userWithRole.FirstName, val => user.FirstName = val);
                UpdateField("LastName", user.LastName, userWithRole.LastName, val => user.LastName = val);
                UpdateField("Department", user.Department, userWithRole.AccountGroup, val => user.Department = val);
                UpdateField("JoiningDate", user.JoiningDate, userWithRole.JoiningDate, val => user.JoiningDate = val);
                UpdateField("Password", user.Password, Encrypt(userWithRole.Password, true), val => user.Password = val);
                UpdateField("AccountGroup", user.AccountGroup, userWithRole.AccountGroup, val => user.AccountGroup = val);
                UpdateField("ContactNumber", user.ContactNumber, userWithRole.ContactNumber, val => user.ContactNumber = val);
                UpdateField("ClientId", user.ClientId, userWithRole.ClientId, val => user.ClientId = val);
                UpdateField("IsActive", user.IsActive, userWithRole.IsActive, val => user.IsActive = val);
                UpdateField("ModifiedBy", user.ModifiedBy, userWithRole.ModifiedBy, val => user.ModifiedBy = val);
                user.ModifiedOn = DateTime.Now;

                // Handle profile picture update
                if (userWithRole.ProfilePic != null)
                {
                    if (!string.IsNullOrEmpty(user.ProfilePath) && File.Exists(user.ProfilePath))
                    {
                        File.Delete(user.ProfilePath);
                    }
                    string folderPath = _configuration["FolderPath"];
                    string folderName = "/ProfileAttachemants/";
                    string portalAddressLink = _configuration["ApiURL"];
                    var fileName = $"{Guid.NewGuid()}_{userWithRole.ProfilePic.FileName.Replace(" ", "_")}";
                    string newFilePath = Path.Combine(folderPath, fileName);
                    string newDbFilePath = portalAddressLink + Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(newFilePath, FileMode.Create))
                    {
                        await userWithRole.ProfilePic.CopyToAsync(stream);
                    }
                    user.ProfilePath = newFilePath;
                    user.PicDbPath = newDbFilePath;
                    updatedFields.Add($"ProfilePic updated to {newDbFilePath}");
                }

                await _mainDbContext.SaveChangesAsync();


                // Fix: Detach old UserRoleMap entity before updating
                var oldUserRole = await _dbContext.UserRoleMaps
                    .AsNoTracking() // Prevent EF from tracking it
                    .FirstOrDefaultAsync(x => x.UserID == userWithRole.UserID && x.IsActive);

                if (oldUserRole != null && oldUserRole.RoleID != userWithRole.RoleID)
                {
                    _dbContext.UserRoleMaps.Remove(oldUserRole);
                    await _dbContext.SaveChangesAsync();

                    // Create and add new UserRoleMap
                    var newUserRole = new UserRoleMap()
                    {
                        RoleID = userWithRole.RoleID,
                        UserID = user.UserID,
                        IsActive = true,
                        CreatedBy = userWithRole.ModifiedBy,
                        CreatedOn = DateTime.Now,
                    };
                    await _dbContext.UserRoleMaps.AddAsync(newUserRole);
                    await _dbContext.SaveChangesAsync();
                    updatedFields.Add($"Role updated to {userWithRole.RoleID}");
                }
                else if (oldUserRole == null)
                {
                    // If no existing role, add a new one
                    var newUserRole = new UserRoleMap()
                    {
                        RoleID = userWithRole.RoleID,
                        UserID = user.UserID,
                        IsActive = true,
                        CreatedBy = userWithRole.ModifiedBy,
                        CreatedOn = DateTime.Now,
                    };
                    await _dbContext.UserRoleMaps.AddAsync(newUserRole);
                    await _dbContext.SaveChangesAsync();
                }

                await transactionMainDb.CommitAsync();
                await transactionDb.CommitAsync();

                if (updatedFields.Any())
                {
                    var logMessage = $"User {userWithRole.UserID} updated fields: {string.Join(", ", updatedFields)}";
                    UsersCreationOrUpdateLog(Guid.Parse(userWithRole.ModifiedBy), logMessage);
                }


                return new UserWithRole
                {
                    UserID = user.UserID,
                    UserName = user.UserName,
                    Email = user.Email,
                    ContactNumber = user.ContactNumber,
                    Password = user.Password,
                    RoleID = userWithRole.RoleID,
                    IsActive = userWithRole.IsActive
                };
            }
            catch (Exception ex)
            {
                await transactionMainDb.RollbackAsync();
                await transactionDb.RollbackAsync();
                throw new Exception(ex.Message ?? "Network Error");
            }
        }


        public async Task<UserWithRole> DeleteUser(string ClientId, Guid UserID)
        {
            try
            {
                var clientCheck = await _dbContext.Clients.FirstOrDefaultAsync(e => e.Id == ClientId);
                if (clientCheck == null)
                {
                    throw new Exception("ClientId does not exist");
                }

                var user = await _mainDbContext.Users.FirstOrDefaultAsync(tb => tb.UserID == UserID && tb.ClientId == ClientId);
                if (user == null)
                {
                    throw new Exception("User not found.");
                }

                // Fetch role-user mappings
                var roleUserMap = await _dbContext.UserRoleMaps.Where(x => x.UserID == UserID).ToListAsync();
                if (roleUserMap.Any())
                {
                    _dbContext.UserRoleMaps.RemoveRange(roleUserMap);
                }

                await _dbContext.SaveChangesAsync();

                var message = $"User Id {user.UserID} role mappings deleted successfully";
                UsersCreationOrUpdateLog(UserID, message);

                return new UserWithRole(); // Return an appropriate UserWithRole object if needed
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }


        #endregion

        #region RoleCreation

        public List<RoleWithApp> GetAllRoles(string ClientId)
        {
            try
            {
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId is Not exists");
                }

                List<RoleWithApp> RoleWithAppList = new List<RoleWithApp>();

                List<Role> RoleList = (from tb in _dbContext.Roles
                                       where tb.IsActive && tb.ClientId == ClientId
                                       orderby tb.CreatedOn descending
                                       select tb).ToList();

                foreach (Role rol in RoleList)
                {
                    RoleWithAppList.Add(new RoleWithApp()
                    {
                        RoleID = rol.RoleID,
                        RoleName = rol.RoleName,
                        IsActive = rol.IsActive,
                        CreatedOn = rol.CreatedOn,
                        ClientId = rol.ClientId,
                        ModifiedOn = rol.ModifiedOn,
                        AppIDList = _dbContext.RoleAppMaps
                            .Where(x => x.RoleID == rol.RoleID && x.IsActive)
                            .Select(r => r.AppID)
                            .ToArray()
                    });
                }

                return RoleWithAppList;
            }
            catch (Exception ex)
            {
                // Handle exceptions here or let them bubble up
                throw new Exception(ex.Message ?? "Network Error");
            }
        }


        public List<RoleWithAppView> GetAllRolesWithApp(string ClientId)
        {
            try
            {
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId is Not exists");
                }

                List<RoleWithAppView> RoleWithAppList = new List<RoleWithAppView>();
                HashSet<Guid> uniqueRoleIDs = new HashSet<Guid>();  // To track unique RoleIDs

                List<Role> RoleList = (from tb in _dbContext.Roles
                                       join tb1 in _dbContext.RoleAppMaps on tb.RoleID equals tb1.RoleID
                                       join tb2 in _dbContext.Apps on tb1.AppID equals tb2.AppID
                                       where tb.IsActive && tb.ClientId == ClientId
                                       orderby tb.CreatedOn descending
                                       select tb).ToList();

                foreach (Role rol in RoleList)
                {
                    // Check if the RoleID is already processed
                    if (uniqueRoleIDs.Contains(rol.RoleID))
                    {
                        continue;  // Skip processing if already added
                    }

                    List<int> appIDList = _dbContext.RoleAppMaps
                        .Where(x => x.RoleID == rol.RoleID && x.IsActive)
                        .Select(r => r.AppID)
                        .ToList();

                    List<string> appNameList = _dbContext.Apps
                        .Where(app => appIDList.Contains(app.AppID))
                        .Select(app => app.AppName)
                        .ToList();

                    RoleWithAppList.Add(new RoleWithAppView()
                    {
                        RoleID = rol.RoleID,
                        RoleName = rol.RoleName,
                        IsActive = rol.IsActive,
                        CreatedOn = rol.CreatedOn,
                        ClientId = rol.ClientId,
                        CreatedBy = rol.CreatedBy,
                        ModifiedOn = rol.ModifiedOn,
                        ModifiedBy = rol.ModifiedBy,
                        AppIDList = appIDList.ToArray(),
                        AppNames = string.Join(", ", appNameList)
                    });

                    // Add the processed RoleID to the HashSet
                    uniqueRoleIDs.Add(rol.RoleID);
                }

                return RoleWithAppList;
            }
            catch (Exception ex)
            {
                // Handle exceptions here or let them bubble up
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<RoleWithApp> CreateRole(RoleWithApp roleWithApp)
        {
            try
            {
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == roleWithApp.ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId is Not exists");
                }

                // Check if the role with the same name already exists
                bool roleExists = await _dbContext.Roles
                    .AnyAsync(tb => tb.IsActive && tb.RoleName == roleWithApp.RoleName);

                if (roleExists)
                {
                    throw new Exception("Role with the same name already exists");
                }

                Role role = new Role
                {
                    RoleID = Guid.NewGuid(),
                    RoleName = roleWithApp.RoleName,
                    CreatedOn = DateTime.Now,
                    CreatedBy = roleWithApp.CreatedBy,
                    ClientId = roleWithApp.ClientId,
                    IsActive = true
                };

                _dbContext.Roles.Add(role);

                // Save changes to add the new role
                await _dbContext.SaveChangesAsync();
                var message1 = $"Role Id {role.RoleID} Created With role name  {role.RoleName}";

                if (roleWithApp.CreatedBy != null)
                {

                    UsersCreationOrUpdateLog(Guid.Parse(roleWithApp.CreatedBy), message1);
                }

                // Add role-app mappings
                foreach (int AppID in roleWithApp.AppIDList)
                {
                    RoleAppMap roleApp = new RoleAppMap
                    {
                        AppID = AppID,
                        RoleID = role.RoleID,
                        IsActive = true,
                        CreatedOn = DateTime.Now
                    };

                    _dbContext.RoleAppMaps.Add(roleApp);
                }

                // Save changes to add role-app mappings
                await _dbContext.SaveChangesAsync();

                // Return the created role with apps
                return new RoleWithApp
                {
                    RoleID = role.RoleID,
                    RoleName = role.RoleName,
                    IsActive = role.IsActive,
                    CreatedOn = role.CreatedOn,
                    ModifiedOn = role.ModifiedOn,
                    AppIDList = roleWithApp.AppIDList,
                    ClientId = roleWithApp.ClientId
                };
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<RoleWithApp> UpdateRole(RoleWithApp roleWithApp)
        {
            try
            {
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == roleWithApp.ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId is Not exists");
                }

                // Check if the role with the same name already exists and has a different ID
                bool roleExists = await _dbContext.Roles
                    .AnyAsync(tb => tb.IsActive && tb.RoleName == roleWithApp.RoleName && tb.RoleID != roleWithApp.RoleID && tb.ClientId == roleWithApp.ClientId);

                if (roleExists)
                {
                    throw new Exception("Role with the same name already exists");
                }

                // Find the role to update
                Role role = await _dbContext.Roles
                    .FirstOrDefaultAsync(tb => tb.IsActive && tb.RoleID == roleWithApp.RoleID && tb.ClientId == roleWithApp.ClientId);

                if (role != null)
                {
                    role.RoleName = roleWithApp.RoleName;
                    role.ClientId = roleWithApp.ClientId;
                    role.IsActive = true;
                    role.ModifiedOn = DateTime.Now;
                    role.ModifiedBy = roleWithApp.ModifiedBy;

                    if (role.RoleName != roleWithApp.RoleName)
                    {
                        var message = $"Role Id {role.RoleID} Role Name {role.RoleName}changed to {roleWithApp.RoleName}";

                        if (roleWithApp.CreatedBy != null)
                        {

                            UsersCreationOrUpdateLog(Guid.Parse(roleWithApp.CreatedBy), message);
                        }
                    }
                    // Save changes to update the role
                    await _dbContext.SaveChangesAsync();
                    // Get the existing role-app mappings
                    List<RoleAppMap> oldRoleAppList = await _dbContext.RoleAppMaps
                        .Where(x => x.RoleID == roleWithApp.RoleID && x.IsActive)
                        .ToListAsync();

                    // Identify role-app mappings that need to be removed
                    List<RoleAppMap> needToRemoveRoleAppList = oldRoleAppList
                        .Where(x => !roleWithApp.AppIDList.Any(y => y == x.AppID))
                        .ToList();

                    // Identify apps to be added to the role
                    List<int> needToAddAppList = roleWithApp.AppIDList
                        .Where(x => !oldRoleAppList.Any(y => y.AppID == x))
                        .ToList();

                    // Delete old role-app mappings
                    _dbContext.RoleAppMaps.RemoveRange(needToRemoveRoleAppList);
                    await _dbContext.SaveChangesAsync();

                    // Create new role-app mappings
                    foreach (int appID in needToAddAppList)
                    {
                        RoleAppMap roleApp = new RoleAppMap()
                        {
                            AppID = appID,
                            RoleID = role.RoleID,
                            IsActive = true,
                            CreatedOn = DateTime.Now,
                        };

                        _dbContext.RoleAppMaps.Add(roleApp);
                    }

                    // Save changes to add new role-app mappings
                    await _dbContext.SaveChangesAsync();

                    return new RoleWithApp
                    {
                        RoleID = roleWithApp.RoleID,
                        RoleName = roleWithApp.RoleName,
                        AppIDList = roleWithApp.AppIDList,
                        ClientId = roleWithApp.ClientId,
                    };
                }
                else
                {
                    throw new Exception("Role not found");
                }
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<RoleWithApp> DeleteRole(Guid roleId)
        {
            try
            {
                var roleToDelete = await _dbContext.Roles.FindAsync(roleId);

                if (roleToDelete == null)
                {
                    throw new ArgumentException("Role not found");
                }

                _dbContext.Roles.Remove(roleToDelete);
                await _dbContext.SaveChangesAsync();
               
                    var message = $"Role Id {roleToDelete.RoleID} Role Name {roleToDelete.RoleName} related data deleted successfully";
                    if (roleToDelete.CreatedBy != null)
                    {

                        UsersCreationOrUpdateLog(Guid.Parse(roleToDelete.CreatedBy), message);
                    }
            
                // Change the status of the RoleApps related to the role
                var roleAppList = await _dbContext.RoleAppMaps
                    .Where(x => x.RoleID == roleId && x.IsActive)
                    .ToListAsync();

                _dbContext.RoleAppMaps.RemoveRange(roleAppList);
                await _dbContext.SaveChangesAsync();

                // Map the deleted role to a RoleWithApp object and return it
                var deletedRoleWithApp = new RoleWithApp
                {
                    RoleID = roleToDelete.RoleID,
                    RoleName = roleToDelete.RoleName
                };

                return deletedRoleWithApp;
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        #endregion

        #region AppControll


        public List<App> GetAllApps()
        {
            try
            {
                var apps = _dbContext.Apps
                    .Where(app => app.IsActive)
                    .ToList();

                return apps;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<App> CreateApp(App app)
        {
            try
            {

                var existingApp = await _dbContext.Apps
                    .FirstOrDefaultAsync(a => a.IsActive && a.AppName == app.AppName);

                if (existingApp != null)
                {
                    throw new InvalidOperationException("An app with the same name already exists");
                }

                app.CreatedOn = DateTime.Now;
                app.IsActive = true;
                _dbContext.Apps.Add(app);
                await _dbContext.SaveChangesAsync();
                var message = $"App Id {app.AppID} Added with {app.AppName}";

                if (app.CreatedBy != null)
                {

                    UsersCreationOrUpdateLog(Guid.Parse(app.CreatedBy), message);
                }

                return app;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<App> UpdateApp(App app)
        {
            try
            {

                var existingApp = await _dbContext.Apps
                    .FirstOrDefaultAsync(a => a.IsActive && a.AppName == app.AppName && a.AppID != app.AppID);

                if (existingApp != null)
                {
                    throw new InvalidOperationException("An app with the same name already exists");
                }

                var appToUpdate = await _dbContext.Apps
                    .FirstOrDefaultAsync(a => a.IsActive && a.AppID == app.AppID);

                if (appToUpdate == null)
                {
                    throw new Exception("App not found");
                }

                appToUpdate.AppName = app.AppName;
                appToUpdate.AppRoute = app.AppRoute;
                appToUpdate.IsActive = true;
                appToUpdate.ModifiedOn = DateTime.Now;
                appToUpdate.ModifiedBy = app.ModifiedBy;
               if (appToUpdate.AppName != app.AppName) 
                {
                    var message = $"App Id {app.AppID} App Name {appToUpdate.AppName} Updated to {app.AppName}";

                    if (app.ModifiedBy != null)
                    {

                        UsersCreationOrUpdateLog(Guid.Parse(app.ModifiedBy), message);
                    }
                }
                


                await _dbContext.SaveChangesAsync();

                return app;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<App> DeleteApp(App app)
        {
            try
            {
                var appToDelete = await _dbContext.Apps
                    .FirstOrDefaultAsync(a => a.IsActive && a.AppID == app.AppID);

                if (appToDelete == null)
                {
                    throw new Exception("App not found");
                }

                _dbContext.Apps.Remove(appToDelete);
                await _dbContext.SaveChangesAsync();
                var message = $"App Id {app.AppID} App Name {appToDelete.AppName} relateddata removed successfully ";

                if (app.ModifiedBy != null)
                {

                    UsersCreationOrUpdateLog(Guid.Parse(app.ModifiedBy), message);
                }
                return appToDelete;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        #endregion

        #region AddLoginHistoryControll

        public async Task<UserLoginHistory> AddLoginHistory(Guid userID, string username)
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

                return loginData;

            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the app", ex);
            }
        }

        public List<UserLoginHistory> GetAllUsersLoginHistory()
        {

            try
            {

                return _dbContext.UserLoginHistory
               .OrderByDescending(login => login.LoginTime)
               .ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the app", ex);

            }
        }

        public List<UserLoginHistory> GetCurrentUserLoginHistory(Guid userID)
        {
            try
            {

                return _dbContext.UserLoginHistory
                    .Where(login => login.UserID == userID)
                    .OrderByDescending(login => login.LoginTime)
                    .ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the app", ex);

            }
        }

        public async Task<UserLoginHistory> SignOut(Guid userID)
        {

            try
            {
                var result = await _dbContext.UserLoginHistory
                .Where(data => data.UserID == userID)
                .OrderByDescending(data => data.LoginTime)
                .FirstOrDefaultAsync();

                if (result != null)
                {
                    result.LogoutTime = DateTime.Now;
                    await _dbContext.SaveChangesAsync();
                }

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the app", ex);

            }
        }

        #endregion

        #region PasswordChangeOption

        public async Task<User> ChangePassword(ChangePassword changePassword)
        {
            var user = await _mainDbContext.Users.FirstOrDefaultAsync(u => u.UserName == changePassword.UserName && u.IsActive);

            if (user == null)
            {
                throw new Exception("User does not exist.");
            }

            string decryptedPassword = Decrypt(user.Password, true);

            if (decryptedPassword != changePassword.CurrentPassword)
            {
                throw new Exception("Current password is incorrect.");
            }

            string defaultPassword = changePassword.CurrentPassword;

            bool isNewPasswordRepeated = Enumerable.Range(1, 5)
                .Any(i => Decrypt(GetPropertyValue(user, $"Pass{i}"), true) == changePassword.NewPassword);

            if (changePassword.NewPassword == defaultPassword || isNewPasswordRepeated)
            {
                throw new Exception("New password should not be the same as the previous 5 passwords.");
            }

            string previousPassword = user.Password;
            user.Password = Encrypt(changePassword.NewPassword, true);
            var index = user.LastChangedPassword;
            var lastchangedIndex = 0;
            if (Decrypt(user.Password, true) != changePassword.NewPassword)
            {
                var message = $"User Id {user.UserID} password {Decrypt(user.Password, true)} changed to {changePassword.NewPassword} ";

                if (user.UserID != null)
                {

                    UsersCreationOrUpdateLog(user.UserID, message);
                }
            }


            //To find lastchangedpassword
            if (!string.IsNullOrEmpty(index))
            {
                if (user.Pass1 != null)
                {
                    var strings = "user.Pass1";
                    if (strings.Contains(index))
                    {
                        lastchangedIndex = 2;
                    }
                }
                if (user.Pass2 != null)
                {
                    var strings = "user.Pass2";
                    if (strings.Contains(index))
                    {
                        lastchangedIndex = 3;
                    }
                }
                if (user.Pass3 != null)
                {
                    var strings = "user.Pass3";
                    if (strings.Contains(index))
                    {
                        lastchangedIndex = 4;
                    }
                }
                if (user.Pass4 != null)
                {
                    var strings = "user.Pass4";
                    if (strings.Contains(index))
                    {
                        lastchangedIndex = 5;
                    }
                }
                if (user.Pass5 != null)
                {
                    var strings = "user.Pass5";
                    if (strings.Contains(index))
                    {
                        lastchangedIndex = 1;
                    }
                }
            }

            if (lastchangedIndex <= 0)
            {
                lastchangedIndex = 1;
            }

            // TO change previous password
            if (lastchangedIndex == 1)
            {
                user.Pass1 = previousPassword;
            }
            else if (lastchangedIndex == 2)
            {
                user.Pass2 = previousPassword;
            }
            else if (lastchangedIndex == 3)
            {
                user.Pass3 = previousPassword;
            }
            else if (lastchangedIndex == 4)
            {
                user.Pass4 = previousPassword;
            }
            else if (lastchangedIndex == 5)
            {
                user.Pass5 = previousPassword;
            }

            user.LastChangedPassword = lastchangedIndex.ToString();
            user.IsActive = true;
            user.ModifiedOn = DateTime.Now;
            user.ExpiryDate = DateTime.Now.AddDays(90);

            await _mainDbContext.SaveChangesAsync();


            return user;
        }

        private string GetPropertyValue(object obj, string propertyName)
        {
            return obj.GetType().GetProperty(propertyName)?.GetValue(obj)?.ToString();
        }

        public async Task<AuthTokenHistory> SendResetLinkToMail(EmailModel emailModel)
        {
            try
            {
                DateTime ExpireDateTime = DateTime.Now.AddMinutes(_tokenTimespan);

                User user = _mainDbContext.Users.FirstOrDefault(tb => tb.Email == emailModel.EmailAddress && tb.IsActive);

                if (user == null)
                {
                    throw new Exception($"User name {emailModel.EmailAddress} is not registered!");
                }

                string code = Encrypt(user.UserID.ToString() + '|' + user.UserName + '|' + ExpireDateTime, true);

                bool sendresult = await _emailService.SendMail(HttpUtility.UrlEncode(code), user.UserName, user.Email, user.UserID.ToString(), emailModel.siteURL);

                if (!sendresult)
                {
                    throw new Exception("Sorry! There is some problem on sending mail");
                }

                var history1 = _dbContext.AuthTokenHistories.FirstOrDefault(tb => tb.UserID == user.UserID && !tb.IsUsed);

                if (history1 == null)
                {
                    AuthTokenHistory history = new AuthTokenHistory()
                    {
                        UserID = user.UserID,
                        Token = code,
                        UserName = user.UserName,
                        EmailAddress = user.Email,
                        CreatedOn = DateTime.Now,
                        ExpireOn = ExpireDateTime,
                        IsUsed = false,
                        Comment = "Reset Token sent successfully"
                    };
                    _dbContext.AuthTokenHistories.Add(history);
             
                        var message = $"Password reset link has been sent for the userid {user.UserID} to the mail {user.Email} ";

                        if (user.UserID != null)
                        {

                            UsersCreationOrUpdateLog(user.UserID, message);
                        }
                   
                }
                else
                {
                    ErrorLog.WriteToFile("ResetPasswordLink/SendLinkToMail : Token already present, updating new token to the user whose mail id is " + user.Email);
                    history1.Token = code;
                    history1.CreatedOn = DateTime.Now;
                    history1.ExpireOn = ExpireDateTime;
                }

                await _dbContext.SaveChangesAsync();


                return history1;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<ActionResult<AuthTokenHistory>> ForgotPassword(ForgotPassword forgotPassword)
        {
            string[] decryptedArray = new string[3];
            AuthTokenHistory tokenHistoryResult = new AuthTokenHistory();

            try
            {
                string result = Decrypt(forgotPassword.Token, true);

                if (result.Contains('|') && result.Split('|').Length == 3)
                {
                    decryptedArray = result.Split('|');
                }
                else
                {
                    throw new Exception("Invalid token!");
                }

                if (decryptedArray.Length == 3)
                {
                    DateTime date = DateTime.Parse(decryptedArray[2].Replace('+', ' '));

                    if (DateTime.Now > date)
                    {
                        throw new Exception("Token Expired");
                    }

                    var DecryptedUserID = decryptedArray[0];

                    User user = await _mainDbContext.Users.FirstOrDefaultAsync(tb => tb.UserID.ToString() == DecryptedUserID && tb.IsActive);

                    if (user != null && user.UserName == decryptedArray[1] && forgotPassword.UserID == user.UserID)
                    {
                        string DefaultPassword = Decrypt(user.Password, true);

                        AuthTokenHistory history = await _dbContext.AuthTokenHistories.FirstOrDefaultAsync(x => x.UserID == user.UserID && !x.IsUsed && x.Token == forgotPassword.Token);

                        if (history != null)
                        {
                            if (forgotPassword.NewPassword == DefaultPassword || user.Pass1 != null && Decrypt(user.Pass1, true) == forgotPassword.NewPassword || user.Pass2 != null && Decrypt(user.Pass2, true) == forgotPassword.NewPassword ||
                                user.Pass3 != null && Decrypt(user.Pass3, true) == forgotPassword.NewPassword || user.Pass4 != null && Decrypt(user.Pass4, true) == forgotPassword.NewPassword || user.Pass5 != null && Decrypt(user.Pass5, true) == forgotPassword.NewPassword)
                            {
                                throw new Exception("Password should not be same as previous 5 passwords");
                            }
                            else
                            {
                                var index = user.LastChangedPassword;
                                var lastchangedIndex = 0;
                                var previousPWD = user.Password;

                                if (!string.IsNullOrEmpty(index))
                                {
                                    if (user.Pass1 != null && index.Contains("user.Pass1"))
                                    {
                                        lastchangedIndex = 2;
                                    }
                                    else if (user.Pass2 != null && index.Contains("user.Pass2"))
                                    {
                                        lastchangedIndex = 3;
                                    }
                                    else if (user.Pass3 != null && index.Contains("user.Pass3"))
                                    {
                                        lastchangedIndex = 4;
                                    }
                                    else if (user.Pass4 != null && index.Contains("user.Pass4"))
                                    {
                                        lastchangedIndex = 5;
                                    }
                                    else if (user.Pass5 != null && index.Contains("user.Pass5"))
                                    {
                                        lastchangedIndex = 1;
                                    }
                                }

                                if (lastchangedIndex <= 0)
                                {
                                    lastchangedIndex = 1;
                                }

                                if (lastchangedIndex == 1)
                                {
                                    user.Pass1 = previousPWD;
                                }
                                else if (lastchangedIndex == 2)
                                {
                                    user.Pass2 = previousPWD;
                                }
                                else if (lastchangedIndex == 3)
                                {
                                    user.Pass3 = previousPWD;
                                }
                                else if (lastchangedIndex == 4)
                                {
                                    user.Pass4 = previousPWD;
                                }
                                else if (lastchangedIndex == 5)
                                {
                                    user.Pass5 = previousPWD;
                                }

                                user.LastChangedPassword = lastchangedIndex.ToString();
                                user.Password = Encrypt(forgotPassword.NewPassword, true);
                                user.IsActive = true;
                                user.ModifiedOn = DateTime.Now;
                                user.ExpiryDate = DateTime.Now.AddDays(90);

                                await _mainDbContext.SaveChangesAsync();

                                history.UsedOn = DateTime.Now;
                                history.IsUsed = true;
                                history.Comment = "Token Used successfully";
                                var message = $"userid {user.UserID} changed to {forgotPassword.NewPassword} ";

                                if (user.UserID != null)
                                {

                                    UsersCreationOrUpdateLog(user.UserID, message);
                                }
                                await _dbContext.SaveChangesAsync();

                                tokenHistoryResult = history;

                                return tokenHistoryResult;
                            }
                        }
                        else
                        {
                            throw new Exception("Token Might have Already Used!");
                        }
                    }
                    else
                    {
                        throw new Exception("Requesting User Not Exist");
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("Master/ForgotPassword : - ", ex);
                throw new Exception(ex.Message ?? "Network error");
            }
            throw new Exception("Invalid Token");
        }

        #endregion



        private void UsersCreationOrUpdateLog(Guid? admissionid, string? message)

        {
            string logEntry = "{" + $"Date: {DateTime.Now:yyyy-MM-dd HH:mm:ss} ~|~  User Id: {admissionid}  ~|~ Message: {message}" + "},";

            string logFilePath = Path.Combine($"Logs", $"UserLog", $"UserLog{DateTime.Now:yyyy-MM-dd}.txt");

            if (!Directory.Exists(Path.GetDirectoryName(logFilePath)))

            {

                Directory.CreateDirectory(Path.GetDirectoryName(logFilePath));

            }

            try

            {
                using (StreamWriter writer = System.IO.File.AppendText($"Logs/UserLog/UserLog{DateTime.Now:yyyy-MM-dd}.txt"))

                {

                    writer.WriteLine(logEntry);

                }

            }

            catch (Exception ex)

            {

                Console.WriteLine($"Error logging login attempt: {ex.Message}");

            }

        }
    }
}

