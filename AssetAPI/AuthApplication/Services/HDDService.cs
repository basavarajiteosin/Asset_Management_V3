using AuthApplication.DbContexts;
using AuthApplication.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagementAPI.Services
{
    public interface IHDDService
    {
        Task<List<HDD>> GetAllHDDDetails();
        Task<HDD> GetHDDDetailById(int id);
        Task<HDD> CreateHDD(HDDDto hDDDto);
        Task<HDD> UpdateHDD(int hDDId, HDDDto hDDDto);
        Task<HDD> RemoveHDD(int hddId);
    }
    public class HDDService : IHDDService
    {
        private readonly AuthAppContext _dbContext;
        private readonly IConfiguration _configuration;
        public HDDService(AuthAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public async Task<List<HDD>> GetAllHDDDetails()
        {
            try
            {
                return await _dbContext.HDD.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve HDD " + ex.Message);
            }
        }
        public async Task<HDD> GetHDDDetailById(int id)
        {
            try
            {
                var hdd = await _dbContext.HDD.FindAsync(id);
                if (hdd == null)
                {
                    throw new Exception("HDD not found!");
                }
                return hdd;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<HDD> CreateHDD(HDDDto hDDDto)
        {
            try
            {
                var existingHDD = await _dbContext.HDD.FirstOrDefaultAsync(t => t.HDDName == hDDDto.HDDName);
                if (existingHDD != null)
                {
                    throw new Exception("HDD Already Exists!");
                }
                var newHDD = new HDD
                {
                    HDDName = hDDDto.HDDName,
                };
                _dbContext.HDD.Add(newHDD);
                await _dbContext.SaveChangesAsync();
                return newHDD;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<HDD> UpdateHDD(int hDDId, HDDDto hDDDto)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingHdd = await _dbContext.HDD.FindAsync(hDDId);
                    if (existingHdd == null)
                    {
                        throw new Exception("RAM not found!");
                    }
                    existingHdd.HDDName = hDDDto.HDDName;

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
        public async Task<HDD> RemoveHDD(int hddId)
        {
            try
            {
                var hDD = await _dbContext.HDD.FindAsync(hddId);
                if (hDD == null)
                {
                    throw new Exception("HDD not found!");
                }

                _dbContext.HDD.Remove(hDD);

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
