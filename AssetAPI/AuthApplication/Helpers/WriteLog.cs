using System;
namespace AuthApplication.Helpers
{
	public class WriteLog
	{
        public static void WriteToFile(string ControllerAction, Exception ex)
        {
            StreamWriter sw = null;
            try
            {
                //string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "LogFiles");
                //if (!Directory.Exists(path))
                //{
                //    Directory.CreateDirectory(path);
                //}
                string path = Path.Combine($"Logs", $"AuthLog", $"AuthLog{DateTime.Now:yyyy-MM-dd}.txt");


                // Ensure the Logs directory exists
                if (!Directory.Exists(Path.GetDirectoryName(path)))

                {

                    Directory.CreateDirectory(Path.GetDirectoryName(path));

                }
                DateTime dt = DateTime.Today;
                DateTime ystrdy = DateTime.Today.AddDays(-15);//keep 15 days backup
                string yday = ystrdy.ToString("yyyy-MM-dd");
                string today = dt.ToString("yyyy-MM-dd");
                string Log = today + ".txt";
                //if (File.Exists(AppDomain.CurrentDomain.BaseDirectory + "\\LogFiles\\Log_" + yday + ".txt"))
                    if (File.Exists(Path.Combine($"Logs", $"AuthLog", $"AuthLog{yday}.txt")))
                    {
                    System.GC.Collect();
                    System.GC.WaitForPendingFinalizers();
                    //File.Delete(AppDomain.CurrentDomain.BaseDirectory + "\\LogFiles\\Log_" + yday + ".txt");
                    File.Delete(Path.Combine($"Logs", $"AuthLog", $"AuthLog{yday}.txt"));
                }
                //sw = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\LogFiles\\Log_" + Log, true);
                //sw.WriteLine($"{DateTime.Now.ToString()} : {ControllerAction} :- {ex.Message}");
                //if (ex.Message.Contains("inner exception") && ex.InnerException != null)
                //{
                //    sw.WriteLine($"{DateTime.Now.ToString()} : {ControllerAction} Inner :- {ex.InnerException.Message}");
                //}
                //sw.Flush();
                //sw.Close();
                using (StreamWriter writer = System.IO.File.AppendText($"Logs/AuthLog/AuthLog{DateTime.Now:yyyy-MM-dd}.txt"))

                {
                    writer.WriteLine($"{DateTime.Now.ToString()} : {ControllerAction} :- {ex.Message}");
                    if (ex.Message.Contains("inner exception") && ex.InnerException != null)
                    {
                        writer.WriteLine($"{DateTime.Now.ToString()} : {ControllerAction} Inner :- {ex.InnerException.Message}");
                    }

                    writer.Flush();
                    writer.Close();

                }
            }
            catch
            {

            }

        }
  



        public static void WriteToFile(string ControllerAction, string text)
        {
            StreamWriter sw = null;
            try
            {
                //string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "LogHistoryFiles");
                string path = Path.Combine($"Logs", $"AuthLog", $"LogHistoryFiles{DateTime.Now:yyyy-MM-dd}.txt");
                //if (!Directory.Exists(path))
                //{
                //    Directory.CreateDirectory(path);
                //}

                if (!Directory.Exists(Path.GetDirectoryName(path)))

                {

                    Directory.CreateDirectory(Path.GetDirectoryName(path));

                }
                DateTime dt = DateTime.Today;
                DateTime ystrdy = DateTime.Today.AddDays(-15);//keep 15 days backup
                string yday = ystrdy.ToString("yyyy-MM-dd");
                string today = dt.ToString("yyyy-MM-dd");
                string Log = today + ".txt";
                //if (File.Exists(AppDomain.CurrentDomain.BaseDirectory + "\\LogHistoryFiles\\Log_" + yday + ".txt"))
                if (File.Exists(Path.Combine($"Logs", $"AuthLog", $"LogHistoryFiles{yday}.txt")))
                {
                    System.GC.Collect();
                    System.GC.WaitForPendingFinalizers();
                    //File.Delete(AppDomain.CurrentDomain.BaseDirectory + "\\LogHistoryFiles\\Log_" + yday + ".txt");
                    File.Delete(Path.Combine($"Logs", $"AuthLog", $"LogHistoryFiles{yday}.txt"));

                }
                //sw = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\LogHistoryFiles\\Log_" + Log, true);
                //sw.WriteLine($"{DateTime.Now.ToString()} : {ControllerAction} :- {text}");
                //sw.Flush();
                //sw.Close();

                using (StreamWriter writer = System.IO.File.AppendText($"Logs/AuthLog/LogHistoryFiles{DateTime.Now:yyyy-MM-dd}.txt"))

                {
                    //writer.WriteLine($"{DateTime.Now.ToString()} : {ControllerAction} :- {ex.Message}");
                    writer.WriteLine($"{DateTime.Now.ToString()} : {ControllerAction} :- {text}");


                    writer.Flush();
                    writer.Close();

                }
            }
            catch
            {

            }

        }
        //public static void WriteToFile(string Message)
        //{
        //    StreamWriter sw = null;
        //    try
        //    {
        //        string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "LogHistoryFiles");
        //        if (!Directory.Exists(path))
        //        {
        //            Directory.CreateDirectory(path);
        //        }
        //        DateTime dt = DateTime.Today;
        //        DateTime ystrdy = DateTime.Today.AddDays(-15);//keep 15 days backup
        //        string yday = ystrdy.ToString("yyyyMMdd");
        //        string today = dt.ToString("yyyyMMdd");
        //        string Log = today + ".txt";
        //        if (File.Exists(AppDomain.CurrentDomain.BaseDirectory + "\\LogHistoryFiles\\Log_" + yday + ".txt"))
        //        {
        //            System.GC.Collect();
        //            System.GC.WaitForPendingFinalizers();
        //            File.Delete(AppDomain.CurrentDomain.BaseDirectory + "\\LogHistoryFiles\\Log_" + yday + ".txt");
        //        }
        //        sw = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\LogHistoryFiles\\Log_" + Log, true);
        //        sw.WriteLine($"{DateTime.Now.ToString()} :- {Message}");
        //        sw.Flush();
        //        sw.Close();
        //    }
        //    catch
        //    {

        //    }

        //}
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

