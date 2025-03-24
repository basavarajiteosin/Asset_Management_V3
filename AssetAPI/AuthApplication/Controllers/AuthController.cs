using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AuthApplication.DbContexts;
using AuthApplication.Helpers;
using AuthApplication.Models;
using AuthApplication.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;


namespace AuthApplication.Controllers
{
    [ApiController]
    [Route("api/AuthController")]
    public class AuthController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly AuthAppContext _dbContext;
        private readonly AuthService _authService;

        public AuthController(IConfiguration configuration, AuthAppContext dbContext, AuthService authService)
        {
            _configuration = configuration;
            _authService = authService;
        }

        //[HttpPost("login")]
        //public async Task<ActionResult> logIn(LoginModel loginModel)
        //{
        //    try
        //    {
        //        var response = _authService.GetToken(loginModel);
        //        return Json(new { success = "success", message = "You have successfully logged in", data = response });

        //    }
        //    catch (Exception ex)
        //    {
        //        ErrorLog.WriteToFile("Auth/GetToken", ex);
        //        //return Json(new { success = "error", message = ex.Message });
        //        //return Json(new { success = "error", message = ex.Message });
        //        throw ex;
        //    }
        //}


        [HttpPost("token")]
        public async Task<IActionResult> GetToken(LoginModel loginModel)
        {
            ErrorLog.WriteToFile("Auth/GetToken:- Get Token Called");
            try
            {
                var authenticationResult = await _authService.LoginUser(loginModel.UserName, loginModel.Password);
                if (authenticationResult != null)
                {
                    IConfiguration JWTSecurityConfig = _configuration.GetSection("Jwt");
                    string securityKey = JWTSecurityConfig.GetValue<string>("Key");
                    string issuer = JWTSecurityConfig.GetValue<string>("Issuer");
                    string audience = JWTSecurityConfig.GetValue<string>("Audience");

                    // Symmetric security key
                    var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));
                    // Signing credentials
                    var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);

                    // Add claims
                    var claims = new List<Claim>();
                    claims.Add(new Claim(ClaimTypes.Name, authenticationResult.UserName));
                    claims.Add(new Claim(ClaimTypes.Role, authenticationResult.UserRole));

                    // Create token
                    var token = new JwtSecurityToken(
                            issuer: issuer,
                            audience: audience,
                            expires: DateTime.Now.AddMinutes(24),
                            signingCredentials: signingCredentials,
                            claims: claims
                        );

                    // Return token
                    authenticationResult.Token = new JwtSecurityTokenHandler().WriteToken(token);
                    var message = $"Userid {authenticationResult.UserID} logged in succewssfully";
                    if (authenticationResult.UserID != null)
                    {

                        LoginLog(authenticationResult.UserID, message);
                    }
                    //return authenticationResult;
                    return Json(new { success = "success", message = "You have successfully logged in", data = authenticationResult });
                }
                else
                {
                    //return Json(new { success = "error", message = "The user name or password is incorrect" });
                    throw new Exception("The user name or password is incorrect");
                }
            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("Auth/GetToken", ex);
                string error = ex.Message;
                //throw new Exception(error);
                return Json(new { success = "error", message = ex.Message });
            }
        }

        private void LoginLog(Guid? userId, string? message)

        {
            string logEntry = "{" + $"Date: {DateTime.Now:yyyy-MM-dd HH:mm:ss} ~|~  User Id: {userId}  ~|~ Message: {message}" + "},";

            string logFilePath = Path.Combine($"Logs", $"LoginLog", $"LoginLog{DateTime.Now:yyyy-MM-dd}.txt");

            if (!Directory.Exists(Path.GetDirectoryName(logFilePath)))

            {

                Directory.CreateDirectory(Path.GetDirectoryName(logFilePath));

            }

            try

            {
                using (StreamWriter writer = System.IO.File.AppendText($"Logs/LoginLog/LoginLog{DateTime.Now:yyyy-MM-dd}.txt"))

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

