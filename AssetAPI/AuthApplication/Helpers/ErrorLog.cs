using System;
namespace AuthApplication.Helpers
{
	public class ErrorLog
	{
        //public static void WriteToFile(string ControllerAction, Exception ex)
        //{
        //    StreamWriter sw = null;
        //    try
        //    {
        //        //string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
        //        string path = Path.Combine("Logs");
               

        //        if (!Directory.Exists(path))
        //        {
        //            Directory.CreateDirectory(path);
        //        }
        //        DateTime dt = DateTime.Today;
        //        DateTime ystrdy = DateTime.Today.AddDays(-15);//keep 15 days backup
        //        string yday = ystrdy.ToString("yyyyMMdd");
        //        string today = dt.ToString("yyyyMMdd");
        //        string Log = today + ".txt";
        //        if (File.Exists("\\LogFiles\\Log_" + yday + ".txt"))
        //        {
        //            System.GC.Collect();
        //            System.GC.WaitForPendingFinalizers();
        //            File.Delete("\\LogFiles\\Log_" + yday + ".txt");
        //        }
        //        sw = new StreamWriter("\\LogFiles\\Log_" + Log, true);
        //        sw.WriteLine($"{DateTime.Now.ToString()} : {ControllerAction} :- {ex.Message}");
        //        if (ex.Message.Contains("inner exception") && ex.InnerException != null)
        //        {
        //            sw.WriteLine($"{DateTime.Now.ToString()} : {ControllerAction} Inner :- {ex.InnerException.Message}");
        //        }
        //        sw.Flush();
        //        sw.Close();
        //    }
        //    catch
        //    {

        //    }

        //}

        //public static void WriteToFile(string Message)
        //{
        //    StreamWriter sw = null;
        //    try
        //    {
        //        string path = Path.Combine("Logs");
        //        if (!Directory.Exists(path))
        //        {
        //            Directory.CreateDirectory(path);
        //        }
        //        DateTime dt = DateTime.Today;
        //        DateTime ystrdy = DateTime.Today.AddDays(-15);//keep 15 days backup
        //        string yday = ystrdy.ToString("yyyyMMdd");
        //        string today = dt.ToString("yyyyMMdd");
        //        string Log = today + ".txt";
        //        if (File.Exists("\\LogFiles\\Log_" + yday + ".txt"))
        //        {
        //            System.GC.Collect();
        //            System.GC.WaitForPendingFinalizers();
        //            File.Delete("\\LogFiles\\Log_" + yday + ".txt");
        //        }
        //        sw = new StreamWriter("\\LogFiles\\Log_" + Log, true);
        //        sw.WriteLine($"{DateTime.Now.ToString()} : {Message}");
        //        sw.Flush();
        //        sw.Close();
        //    }
        //    catch
        //    {

        //    }

        //}

        public static void WriteToFile(string ControllerAction, Exception ex)
        {
            try
            {
                // Get the base directory and create a Logs folder inside it
                string baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
                string logDirectory = Path.Combine($"Logs", $"AuthLog", $"AuthLog{DateTime.Now:yyyy-MM-dd}.txt");
                

                // Ensure the Logs directory exists
                if (!Directory.Exists(Path.GetDirectoryName(logDirectory)))

                {

                    Directory.CreateDirectory(Path.GetDirectoryName(logDirectory));

                }

                // Generate log file name based on today's date
                string today = DateTime.Today.ToString("yyyy-MM-dd");
                //string logFilePath = Path.Combine(logDirectory, $"Log_{today}.txt");
                string logFilePath = Path.Combine($"Logs", $"AuthLog", $"AuthLog{today}.txt");


                // Remove old logs (older than 15 days)
                DateTime oldDate = DateTime.Today.AddDays(-15);
                //string oldLogFilePath = Path.Combine(logDirectory, $"Log_{oldDate:yyyyMMdd}.txt");
                string oldLogFilePath = Path.Combine($"Logs", $"AuthLog", $"AuthLog{oldDate:yyyy-MM-dd}.txt");

                if (File.Exists(oldLogFilePath))
                {
                    File.Delete(oldLogFilePath);
                }

                // Write the log entry
                //using (StreamWriter sw = new StreamWriter(logFilePath, true))
                //{
                //    sw.WriteLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss} : {ControllerAction} :- {ex.Message}");

                //    if (ex.InnerException != null)
                //    {
                //        sw.WriteLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss} : {ControllerAction} Inner Exception :- {ex.InnerException.Message}");
                //    }
                //}

                using (StreamWriter writer = System.IO.File.AppendText($"Logs/AuthLog/AuthLog{DateTime.Now:yyyy-MM-dd}.txt"))

                {
                    writer.WriteLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss} : {ControllerAction} :- {ex.Message}");
                    if (ex.InnerException != null)
                    {
                        writer.WriteLine(($"{DateTime.Now:yyyy-MM-dd HH:mm:ss} : {ControllerAction} Inner Exception :- {ex.InnerException.Message}"));
                    }

                }
            }
            catch (Exception logEx)
            {
                // Optional: Handle/log any exceptions that occur while writing logs
                Console.WriteLine($"Error writing to log: {logEx.Message}");
            }
        }
        public static void WriteToFile(string Message)
        {
            string logFilePath = Path.Combine($"Logs", $"AuthLog", $"AuthLog{DateTime.Now:yyyy-MM-dd}.txt");

          
            
            StreamWriter sw = null;
            try
            {
                if (!Directory.Exists(Path.GetDirectoryName(logFilePath)))

                {

                    Directory.CreateDirectory(Path.GetDirectoryName(logFilePath));

                }
                DateTime dt = DateTime.Today;
                DateTime ystrdy = DateTime.Today.AddDays(-15);//keep 15 days backup
                string yday = ystrdy.ToString("yyyy-MM-dd");
                string today = dt.ToString("yyyy-MM-dd");
                string Log = today + ".txt";
                //if (File.Exists(AppDomain.CurrentDomain.BaseDirectory + "\\LogHistoryFiles\\Log_" + yday + ".txt"))
                if (File.Exists(Path.Combine($"Logs", $"AuthLog", $"AuthLog{yday}.txt")))
                    {
                    System.GC.Collect();
                    System.GC.WaitForPendingFinalizers();
                    File.Delete(Path.Combine($"Logs", $"AuthLog", $"AuthLog{yday}.txt"));
                }
                using (StreamWriter writer = System.IO.File.AppendText($"Logs/AuthLog/AuthLog{DateTime.Now:yyyy-MM-dd}.txt"))

                {

                    writer.WriteLine($"{DateTime.Now.ToString()} :- {Message}");
                    writer.Flush();
                    writer.Close();

                }
                //sw = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\LogHistoryFiles\\Log_" + Log, true);
                //sw.WriteLine($"{DateTime.Now.ToString()} :- {Message}");
                //writer.Flush();
                //writer.Close();
            }
            catch
            {

            }
        }


    }
}

