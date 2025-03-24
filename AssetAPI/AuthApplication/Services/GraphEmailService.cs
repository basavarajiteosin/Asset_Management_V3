
using Newtonsoft.Json;
using System.Net.Http.Headers;
using AuthApplication.Helpers;
using AuthApplication.Models;
using AuthApplication.DbContexts;

namespace GlobalTrackersAPI.Services
{

    public class GraphEmailService
    {
        public static HttpClient ApiClient { get; set; } = new HttpClient();
        private static readonly string baseApiUrl = "https://graph.microsoft.com/v1.0";
        private readonly IConfiguration _configuration;
        private readonly AuthAppContext _dbContext;

        public GraphEmailService(IConfiguration configuration, AuthAppContext dbContext)
        {
            _configuration = configuration;
            _dbContext = dbContext;
        }

        public static void InitializeClient()
        {
            if (ApiClient == null)
                ApiClient = new HttpClient();

            ApiClient.DefaultRequestHeaders.Accept.Clear();
            ApiClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }


        public async Task<AccessTokenModel> GetAccessTokenAsync()
        {
            // Accessing values from configuration (from appsettings.json)
            string clientId = _configuration["ClientId"];
            string tenantId = _configuration["TenantId"];
            string clientSecret = _configuration["ClientSecret"];

            string url = $"https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token";

            var data = new Dictionary<string, string>
        {
            { "grant_type", "client_credentials" },
            { "scope", "https://graph.microsoft.com/.default" },
            { "client_id", clientId },
            { "client_secret", clientSecret }
        };

            using (HttpClient client = new())
            {
                var response = await client.PostAsync(url, new FormUrlEncodedContent(data));

                if (response.IsSuccessStatusCode)
                {
                    // Deserialize the response to the AccessTokenModel
                    return await response.Content.ReadFromJsonAsync<AccessTokenModel>();
                }
                else
                {
                    // Handle failure, log error, or throw exception
                    string errorResponse = await response.Content.ReadAsStringAsync();
                    EmailLog("Failed to retrieve access token:- " + errorResponse);
                    throw new Exception("Failed to retrieve access token."); 
                }
            }
        }

        // Method to send an email
        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            string fromEmail = _configuration["ConfigFromEmail"];
            var accessTokenResponse = await GetAccessTokenAsync();

            if (accessTokenResponse == null)
            {
                throw new Exception("Failed to retrieve access token.");
            }

            var client = new HttpClient();

            // Set Authorization header
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessTokenResponse.access_token);

            var emailMessage = new
            {
                message = new
                {
                    subject = subject,
                    body = new
                    {
                        contentType = "HTML",  // Use "Text" if you want to send HTML emails
                        content = body
                    },
                    from = new
                    {
                        emailAddress = new { address = fromEmail }  // Set the 'From' address here
                    },
                    toRecipients = new[]
            {
                new { emailAddress = new { address = toEmail } }  // Set the recipient address here
            }
                },
                saveToSentItems = "true"  // Save the email to the Sent Items folder
            };


            var urlGraph = $"{baseApiUrl}/users/{fromEmail}/sendMail";

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(emailMessage), System.Text.Encoding.UTF8, "application/json");
                var response = await client.PostAsync(urlGraph, content);

                if (response.IsSuccessStatusCode)
                {

                    EmailLog($"Mail has been sent successfully to {toEmail} with subject {subject}.");
                }
                else
                {
                    string errorResponse = await response.Content.ReadAsStringAsync();
                    EmailLog("GraphAPI/SendMail/Exception:- " + errorResponse);
                }
            }
            catch (HttpRequestException httpEx)
            {
                // Handle HTTP request exceptions (e.g., connection issues, timeout)
                string errorMsg = $"HttpRequestException occurred while sending email: {httpEx.Message}";
                EmailLog("GraphAPI/SendMail/HttpRequestException: " + errorMsg);
            }
            catch (TaskCanceledException taskEx)
            {
                // Handle task cancellation (e.g., timeout issues)
                string errorMsg = $"TaskCanceledException occurred while sending email: {taskEx.Message}";
                EmailLog("GraphAPI/SendMail/TaskCanceledException: " + errorMsg);
            }
            catch (JsonException jsonEx)
            {
                // Handle JSON serialization/deserialization errors
                string errorMsg = $"JsonException occurred while serializing email message: {jsonEx.Message}";
                EmailLog("GraphAPI/SendMail/JsonException: " + errorMsg);
            }
            catch (Exception ex)
            {
                // Handle all other general exceptions
                string errorMsg = $"Exception occurred while sending email: {ex.Message}";
                EmailLog("GraphAPI/SendMail/Exception: " + errorMsg);
            }
        }

        private static readonly object _logLock = new object(); // For thread safety

        private void EmailLog(string? message)
        {
            string logEntry = "{" + $"Date: {DateTime.Now:yyyy-MM-dd HH:mm:ss} ~|~ Message: {message}" + "},";
            string logDirectory = Path.Combine("Logs", "EmailLog");
            string logFilePath = Path.Combine(logDirectory, "EmailLog.txt");

            // Ensure the directory exists
            try
            {
                if (!Directory.Exists(logDirectory))
                {
                    Directory.CreateDirectory(logDirectory);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to create log directory: {ex.Message}");
                return; // Exit if directory creation fails
            }

            // Use a lock to ensure thread safety
            lock (_logLock)
            {
                // Retry mechanism (e.g., 3 attempts)
                int maxRetries = 3;
                for (int attempt = 1; attempt <= maxRetries; attempt++)
                {
                    try
                    {
                        using (StreamWriter writer = new StreamWriter(logFilePath, true)) // Append mode
                        {
                            writer.WriteLine(logEntry);
                        }
                        break; // Exit the loop if writing succeeds
                    }
                    catch (IOException ex) when (attempt < maxRetries)
                    {
                        // Log the retry attempt
                        Console.WriteLine($"Attempt {attempt} failed. Retrying... Error: {ex.Message}");
                        Thread.Sleep(500); // Wait before retrying
                    }
                    catch (Exception ex)
                    {
                        // Log the failure to an alternative location
                        Console.WriteLine($"Failed to write to log file: {ex.Message}");
                        break; // Exit the loop after final attempt
                    }
                }
            }
        }
    }


    
}
