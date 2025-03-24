using AuthApplication.DbContexts;
using AuthApplication.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagementAPI.Services
{

    public interface IWarrantyStatusService
    {
        Task<List<WarrantyStatus>> GetAllWarrantyDDetails();
        Task<WarrantyStatus> GetWarrantyDetailById(int id);
        Task<WarrantyStatus> CreateWarranty(WarrantyStatusDto warrantyStatusDto);
        Task<WarrantyStatus> UpdateWarranty(int WarrantyId, WarrantyStatusDto warrantyStatusDto);
        Task<WarrantyStatus> RemoveWarranty(int WarrantyID);
    }
    public class WarrantyStatusService : IWarrantyStatusService
    {
        private readonly AuthAppContext _dbContext;
        private readonly IConfiguration _configuration;
        public WarrantyStatusService(AuthAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }
        public async Task<List<WarrantyStatus>> GetAllWarrantyDDetails()
        {
            try
            {
                return await _dbContext.WarrantyStatus.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve Warranty Status " + ex.Message);
            }
        }
        public async Task<WarrantyStatus> GetWarrantyDetailById(int id)
        {
            try
            {
                var hdd = await _dbContext.WarrantyStatus.FindAsync(id);
                if (hdd == null)
                {
                    throw new Exception("Warranty Status not found!");
                }
                return hdd;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<WarrantyStatus> CreateWarranty(WarrantyStatusDto warrantyStatusDto)
        {
            try
            {
                var existingWarranty = await _dbContext.WarrantyStatus.FirstOrDefaultAsync(t => t.Warranty == warrantyStatusDto.Warranty);
                if (existingWarranty != null)
                {
                    throw new Exception("Warranty Already Exists!");
                }
                var newWarranty = new WarrantyStatus
                {
                    Warranty = warrantyStatusDto.Warranty,
                };
                _dbContext.WarrantyStatus.Add(newWarranty);
                await _dbContext.SaveChangesAsync();
                return newWarranty;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<WarrantyStatus> UpdateWarranty(int WarrantyId, WarrantyStatusDto warrantyStatusDto)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingHdd = await _dbContext.WarrantyStatus.FindAsync(WarrantyId);
                    if (existingHdd == null)
                    {
                        throw new Exception("Warranty not found!");
                    }
                    existingHdd.Warranty = warrantyStatusDto.Warranty;

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
        public async Task<WarrantyStatus> RemoveWarranty(int hddId)
        {
            try
            {
                var hDD = await _dbContext.WarrantyStatus.FindAsync(hddId);
                if (hDD == null)
                {
                    throw new Exception("Warranty not found!");
                }

                _dbContext.WarrantyStatus.Remove(hDD);

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
