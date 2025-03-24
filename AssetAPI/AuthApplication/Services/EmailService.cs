using System;
using System.Net;
using System.Net.Mail;
using System.Text;
using AssetAuthApplication.DbContexts;
using AuthApplication.DbContexts;
using AuthApplication.Helpers;
using AuthApplication.Models;
using GlobalTrackersAPI.Services;
using Microsoft.EntityFrameworkCore;
using static System.Net.WebRequestMethods;

namespace AuthApplication.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;
        private readonly AuthAppContext _dbContext;
        private readonly GraphEmailService _graphEmailService;
        private readonly MainDbContext _mainDbContext;

        public EmailService(IConfiguration configuration, AuthAppContext dbContext, GraphEmailService graphEmailService, MainDbContext mainDbContext)
        {
            _configuration = configuration;
            _dbContext = dbContext;
            _graphEmailService = graphEmailService;
            _mainDbContext = mainDbContext;

        }

        //public async Task<bool> SendInitializationMail(string FirstName, string LastName, string toEmail, string Password, string url)
        //{
        //    try
        //    {
        //        var ec = _dbContext.EmailConfiguration.FirstOrDefault(k => k.IsActive && !k.IsSSL && k.ID == 1);

        //        if (ec != null)
        //        {
        //            MailMessage message = new MailMessage();
        //            string subject = "User Creation";
        //            StringBuilder sb = new StringBuilder();

        //            sb.Append($@"
        //             <div style='padding:20px;'>
        //                 <div style='border:1px solid #dbdbdb;padding:20px'>
        //                     <div style='font-family: Segoe UI;'>
        //                         <h2 align='center'>AuthApplication</h2>
        //                         <div>
        //                             <div style='border:1px solid white;background-color: white !important'>
        //                                 <p>Dear {FirstName} {LastName},</p>
        //                                 <p>Your account has been created.</p>
        //                                 <p>Account Details Is Following</p>
        //                                 <p><a href='{url}/#' rel='noopener noreferrer' target='_blank'>Login</a></p>
        //                                 <p>UserName: {toEmail}</p>
        //                                 <p>Password: {Password}</p>
        //                                 <p></p>
        //                                 <p>&nbsp;</p>
        //                                 <p>Regards,</p>
        //                                 <p>Admin</p>
        //                                 <p></p>
        //                                 <p align='center' style='font-size:10px;'>Sensitivity: Internal &amp; Restricted</p>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>&apos;The information contained in this electronic message and any attachments to this message are intended for the exclusive use of the addressee(s) and may contain proprietary, confidential or privileged information. If you are not the intended recipient, you should not disseminate, distribute or copy this e-mail. Please notify the sender immediately and destroy all copies of this message and any attachments. WARNING: Computer viruses can be transmitted via email. The recipient should check this email and any attachments for the presence of viruses. The company accepts no liability for any damage caused by any virus transmitted by this email.&apos;
        //             </div>
        //             ");

        //            SmtpClient client = new SmtpClient(ec.ServerAddress);
        //            client.Port = int.Parse(ec.OutgoingPort);
        //            client.EnableSsl = true;
        //            client.Timeout = 60000;
        //            client.UseDefaultCredentials = false;
        //            client.Credentials = new System.Net.NetworkCredential(ec.MailAddress, ec.Password);

        //            MailMessage reportEmail = new MailMessage(ec.UserName, toEmail, subject, sb.ToString());
        //            reportEmail.BodyEncoding = UTF8Encoding.UTF8;
        //            reportEmail.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;
        //            reportEmail.IsBodyHtml = true;

        //            ServicePointManager.ServerCertificateValidationCallback += (sender, certificate, chain, sslPolicyErrors) => true;

        //            await client.SendMailAsync(reportEmail);

        //            WriteLog.WriteToFile($"Registration link has been sent successfully to {toEmail}");
        //            return true;
        //        }
        //        else
        //        {
        //            throw new Exception("Email configuration not found");
        //        }
        //    }
        //    catch (SmtpFailedRecipientsException ex)
        //    {
        //        for (int i = 0; i < ex.InnerExceptions.Length; i++)
        //        {
        //            SmtpStatusCode status = ex.InnerExceptions[i].StatusCode;
        //            if (status == SmtpStatusCode.MailboxBusy || status == SmtpStatusCode.MailboxUnavailable)
        //            {
        //                WriteLog.WriteToFile($"User/SendMail/MailboxBusy/MailboxUnavailable/SmtpFailedRecipientsException:Inner- {ex.InnerExceptions[i].Message}");
        //            }
        //            else
        //            {
        //                WriteLog.WriteToFile($"User/SendMail/SmtpFailedRecipientsException:Inner- {ex.InnerExceptions[i].Message}");
        //            }
        //        }
        //        WriteLog.WriteToFile($"User/SendMail/SmtpFailedRecipientsException:- {ex.Message}", ex);
        //        return false;
        //    }
        //    catch (SmtpException ex)
        //    {
        //        WriteLog.WriteToFile($"User/SendMail/SmtpException:- {ex.Message}", ex);
        //        return false;
        //    }
        //    catch (Exception ex)
        //    {
        //        WriteLog.WriteToFile($"User/SendMail/Exception:- {ex.Message}", ex);
        //        return false;
        //    }
        //}

        public async Task<bool> SendInitializationMail(string FirstName, string LastName, string toEmail, string Password, string url)
        {
            try
            {

                string emailSubject = "User Creation";
                string emailBody = $@"
        <html>
            <body>
                <div style='padding:20px;'>
                    <div style='border:1px solid #dbdbdb;padding:20px'>
                        <div style='font-family: Segoe UI;'>
                            <h2 align='center'>AuthApplication</h2>
                            <div>
                                <div style='border:1px solid white;background-color: white !important'>
                                    <p>Dear {FirstName} {LastName},</p>
                                    <p>Your account has been created.</p>
                                    <p>Account Details:</p>
                                    <p><a href='{url}/#' rel='noopener noreferrer' target='_blank'>Login</a></p>
                                    <p>UserName: {toEmail}</p>
                                    <p>Password: {Password}</p>
                                    <p>Regards,</p>
                                    <p>Admin</p>
                                    <p align='center' style='font-size:10px;'>Sensitivity: Internal &amp; Restricted</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>";

                await _graphEmailService.SendEmailAsync(toEmail, emailSubject, emailBody);
                WriteLog.WriteToFile(toEmail, $"User creation email has been sent successfully to {FirstName} {LastName}.");
                return true;
            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("SendInitializationMail1/SendMail/Exception:- " + ex.Message);
                return false;
            }
        }



        public async Task<bool> SendMail(string code, string UserName, string toEmail, string userID, string siteURL)
        {
            try
            {
                string emailSubject = "Reset password";

                string emailBody = $@"<html><head></head><body> <div style='border:1px solid #dbdbdb;'> <div style='padding: 20px 20px; background-color: #fff06769;text-align: center;font-family: Segoe UI;'> <p> <h2>Auth Application</h2> </p> </div> <div style='background-color: #f8f7f7;padding: 20px 20px;font-family: Segoe UI'> <div style='padding: 20px 20px;border:1px solid white;background-color: white !important'> <p>Dear {toEmail},</p> <p>We have received a request to reset your password, you can reset it now by clicking reset button</p> <div style='text-align: end;'>" + "<a href=\"" + siteURL + "?token=" + code + "&Id=" + userID + "\"" + "><button style='width: 90px;height: 28px; background-color: #039be5;color: white'>Reset</button></a></div> <p>Regards,</p> <p>Admin</p> </div> </div> </div></body></html>";



                await _graphEmailService.SendEmailAsync(toEmail, emailSubject, emailBody);
                WriteLog.WriteToFile(toEmail, $"Forgot Password Mail been sent successfully to {toEmail}.");
                return true;
            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("ResetLinkMail/SendMail/Exception:- " + ex.Message, ex);
                return false;
            }
        }

        public async Task<string> GenerateAndSendOTP(string email)
        {
            // Generate the OTP using your desired logic
            Random random = new Random();
            string generatedOtp = random.Next(100000, 999999).ToString();
            if (!string.IsNullOrEmpty(generatedOtp))
            {
                var user = await _mainDbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (user != null)
                {
                    DateTime expiryTime = DateTime.Now.AddMinutes(10);
                    // Save OTP details to the database
                    var passwordReset = new PasswordResetOtpHistory
                    {
                        Email = email,
                        OTP = generatedOtp,
                        OTPIsActive = true,
                        CreatedOn = DateTime.Now,
                        ExpiryOn = expiryTime,
                        CreatedBy = user.Email
                    };
                    _dbContext.PasswordResetOtpHistorys.Add(passwordReset);
                    await _dbContext.SaveChangesAsync();
                }
            }

            // Send OTP via email
            try
            {
                string emailSubject = "Password Reset OTP";

                string messageBody = $"Your OTP is: {generatedOtp}. Please use it within 5 minutes.";



                await _graphEmailService.SendEmailAsync(email, emailSubject, messageBody);
                ErrorLog.WriteToFile($"Sent email to user {{0}} successfully\" to {email}");
                return generatedOtp;
            }
            catch (Exception ex)
            {
                // Handle exceptions when sending email
                throw new Exception("Failed to send OTP via email", ex);
            }
        }


    }
}

