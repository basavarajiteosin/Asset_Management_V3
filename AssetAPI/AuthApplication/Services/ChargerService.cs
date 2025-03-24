using AuthApplication.DbContexts;
using AuthApplication.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagementAPI.Services
{
    public interface IChargerService
    {
        Task<List<Charger>> GetAllChargerDetails();
        Task<Charger> GetChargerDetailById(int id);
        Task<Charger> CreateCharger(ChargerDto chargerDto);
        Task<Charger> UpdateCharger(int chargerId, ChargerDto chargerDto);
        Task<Charger> RemoveCharger(int chargerId);
    }
    public class ChargerService : IChargerService
    {
        private readonly AuthAppContext _dbContext;
        private readonly IConfiguration _configuration;
        public ChargerService(AuthAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }
        public async Task<List<Charger>> GetAllChargerDetails()
        {
            try
            {
                return await _dbContext.Charger.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve Charger " + ex.Message);
            }
        }
        public async Task<Charger> GetChargerDetailById(int id)
        {
            try
            {
                var hdd = await _dbContext.Charger.FindAsync(id);
                if (hdd == null)
                {
                    throw new Exception("Charger not found!");
                }
                return hdd;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<Charger> CreateCharger(ChargerDto chargerDto)
        {
            try
            {
                var existingWarranty = await _dbContext.Charger.FirstOrDefaultAsync(t => t.ChargerName == chargerDto.ChargerName);
                if (existingWarranty != null)
                {
                    throw new Exception("Charger Already Exists!");
                }
                var newWarranty = new Charger
                {
                    ChargerName = chargerDto.ChargerName,
                };
                _dbContext.Charger.Add(newWarranty);
                await _dbContext.SaveChangesAsync();
                return newWarranty;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<Charger> UpdateCharger(int chargerId, ChargerDto chargerDto)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingHdd = await _dbContext.Charger.FindAsync(chargerId);
                    if (existingHdd == null)
                    {
                        throw new Exception("Charger not found!");
                    }
                    existingHdd.ChargerName = chargerDto.ChargerName;

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
        public async Task<Charger> RemoveCharger(int hddId)
        {
            try
            {
                var hDD = await _dbContext.Charger.FindAsync(hddId);
                if (hDD == null)
                {
                    throw new Exception("Charger not found!");
                }

                _dbContext.Charger.Remove(hDD);

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

