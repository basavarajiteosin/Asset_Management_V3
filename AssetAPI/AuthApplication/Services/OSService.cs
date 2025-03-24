using AuthApplication.DbContexts;
using AuthApplication.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagementAPI.Services
{
 
    public interface IOSService
    {
        Task<List<OS>> GetAllOSDetails();
        Task<OS> GetOSDetailById(int id);
        Task<OS> CreateOS(OSDto oSDto);
        Task<OS> UpdateOS(int oSId, OSDto oSDto);
        Task<OS> RemoveOS(int osID);
    }
    public class OSService : IOSService
    {
        private readonly AuthAppContext _dbContext;
        private readonly IConfiguration _configuration;
        public OSService(AuthAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }
        public async Task<List<OS>> GetAllOSDetails()
        {
            try
            {
                return await _dbContext.OS.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve OS " + ex.Message);
            }
        }
        public async Task<OS> GetOSDetailById(int id)
        {
            try
            {
                var hdd = await _dbContext.OS.FindAsync(id);
                if (hdd == null)
                {
                    throw new Exception("OS not found!");
                }
                return hdd;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<OS> CreateOS(OSDto oSDto)
        {
            try
            {
                var existingWarranty = await _dbContext.OS.FirstOrDefaultAsync(t => t.OSName == oSDto.OSName);
                if (existingWarranty != null)
                {
                    throw new Exception("OS Already Exists!");
                }
                var newWarranty = new OS
                {
                    OSName = oSDto.OSName,
                };
                _dbContext.OS.Add(newWarranty);
                await _dbContext.SaveChangesAsync();
                return newWarranty;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<OS> UpdateOS(int WarrantyId, OSDto oSDto)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingHdd = await _dbContext.OS.FindAsync(WarrantyId);
                    if (existingHdd == null)
                    {
                        throw new Exception("OS not found!");
                    }
                    existingHdd.OSName = oSDto.OSName;

                    _dbContext.Entry(existingHdd).State = EntityState.Modified;

                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                    return existingHdd;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
        }
        public async Task<OS> RemoveOS(int hddId)
        {
            try
            {
                var hDD = await _dbContext.OS.FindAsync(hddId);
                if (hDD == null)
                {
                    throw new Exception("OS not found!");
                }

                _dbContext.OS.Remove(hDD);

                await _dbContext.SaveChangesAsync();

                return hDD;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
    }
}
