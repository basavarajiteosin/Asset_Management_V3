using AuthApplication.DbContexts;
using AuthApplication.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using PMOAPIV2.Services;
using System.Diagnostics.Eventing.Reader;
using System.Text;
using System.Threading.Tasks;

namespace AssetManagementAPI.Services
{
    public interface IGenrationService
    {
        Task<List<Genration>> GetAllGenrationDetails();
        Task<Genration> GetGenrationDetailById(int id);
        Task<Genration> CreateGenration(GenrationDto genrationDto);
        Task<Genration> UpdateGenration(int genrationId, GenrationDto genrationDto);
        Task<Genration> RemoveGenration(int genrationId);
    }

    public class GenrationService : IGenrationService
    {
        private readonly AuthAppContext _dbContext;
        private readonly IConfiguration _configuration;
        public GenrationService(AuthAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public async Task<List<Genration>> GetAllGenrationDetails()
        {
            try
            {
                return await _dbContext.Genration.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve Genration " + ex.Message);
            }
        }
        public async Task<Genration> GetGenrationDetailById(int id)
        {
            try
            {
                var genration = await _dbContext.Genration.FindAsync(id);
                if (genration == null)
                {
                    throw new Exception("Genration not found!");
                }

                return genration;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<Genration> CreateGenration(GenrationDto genrationDto)
        {
            try
            {
                var existingGenration = await _dbContext.Genration.FirstOrDefaultAsync(t => t.GenrationName == genrationDto.GenrationName);
                if (existingGenration != null)
                {
                    throw new Exception("Genration Already Exists!");
                }

                var newGenration = new Genration
                {
                    GenrationName = genrationDto.GenrationName,

                };
                _dbContext.Genration.Add(newGenration);
                await _dbContext.SaveChangesAsync();

                return newGenration;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<Genration> UpdateGenration(int genrationId, GenrationDto genrationDto)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingGenration = await _dbContext.Genration.FindAsync(genrationId);
                    if (existingGenration == null)
                    {
                        throw new Exception("Genration not found!");
                    }

                    existingGenration.GenrationName = genrationDto.GenrationName;


                    _dbContext.Entry(existingGenration).State = EntityState.Modified;

                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                    return existingGenration;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
        }
        public async Task<Genration> RemoveGenration(int genrationId)
        {
            try
            {
                var genration = await _dbContext.Genration.FindAsync(genrationId);
                if (genration == null)
                {
                    throw new Exception("Genration not found!");
                }

                _dbContext.Genration.Remove(genration);

                await _dbContext.SaveChangesAsync();

                return genration;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
    }
}
