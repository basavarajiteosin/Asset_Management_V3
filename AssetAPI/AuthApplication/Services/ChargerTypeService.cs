using AuthApplication.DbContexts;
using AuthApplication.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagementAPI.Services
{
       public interface IChargerTypeService
    {
        Task<List<ChargerType>> GetAllChargerTypeDetails();
        Task<ChargerType> GetChargerTypeDetailById(int id);
        Task<ChargerType> CreateChargerType(ChargerTypeDto chargerTypeDto);
        Task<ChargerType> UpdateChargerType(int chargerTypeId, ChargerTypeDto chargerTypeDto);
        Task<ChargerType> RemoveChargerType(int chargerTypeId);
    }
    public class ChargerTypeService : IChargerTypeService
    {
        private readonly AuthAppContext _dbContext;
        private readonly IConfiguration _configuration;
        public ChargerTypeService(AuthAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }
        public async Task<List<ChargerType>> GetAllChargerTypeDetails()
        {
            try
            {
                return await _dbContext.ChargerType.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve Charger Type" + ex.Message);
            }
        }
        public async Task<ChargerType> GetChargerTypeDetailById(int id)
        {
            try
            {
                var hdd = await _dbContext.ChargerType.FindAsync(id);
                if (hdd == null)
                {
                    throw new Exception("Charger Type not found!");
                }
                return hdd;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<ChargerType> CreateChargerType(ChargerTypeDto chargerDto)
        {
            try
            {
                var existingWarranty = await _dbContext.ChargerType.FirstOrDefaultAsync(t => t.ChargerTypeName == chargerDto.ChargerTypeName);
                if (existingWarranty != null)
                {
                    throw new Exception("Charger Type Already Exists!");
                }
                var newWarranty = new ChargerType
                {
                    ChargerTypeName = chargerDto.ChargerTypeName,
                };
                _dbContext.ChargerType.Add(newWarranty);
                await _dbContext.SaveChangesAsync();
                return newWarranty;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<ChargerType> UpdateChargerType(int chargerId, ChargerTypeDto chargerDto)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingHdd = await _dbContext.ChargerType.FindAsync(chargerId);
                    if (existingHdd == null)
                    {
                        throw new Exception("Charger Type not found!");
                    }
                    existingHdd.ChargerTypeName = chargerDto.ChargerTypeName;

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
        public async Task<ChargerType> RemoveChargerType(int hddId)
        {
            try
            {
                var hDD = await _dbContext.ChargerType.FindAsync(hddId);
                if (hDD == null)
                {
                    throw new Exception("Charger Type not found!");
                }

                _dbContext.ChargerType.Remove(hDD);

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
