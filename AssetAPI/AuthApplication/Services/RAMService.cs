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
    public interface IRAMService
    {
        Task<List<RAM>> GetAllRAMDetails();
        Task<RAM> GetRAMDetailById(int id);
        Task<RAM> CreateRAM(RAMDto rAMDto);
        Task<RAM> UpdateRAM(int ramId, RAMDto rAMDto);
        Task<RAM> RemoveRAM(int ramId);
    }
    public class RAMService : IRAMService
    {
        private readonly AuthAppContext _dbContext;
        private readonly IConfiguration _configuration;
        public RAMService(AuthAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public async Task<List<RAM>> GetAllRAMDetails()
        {
            try
            {
                return await _dbContext.RAM.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve RAM " + ex.Message);
            }
        }
        public async Task<RAM> GetRAMDetailById(int id)
        {
            try
            {
                var ram = await _dbContext.RAM.FindAsync(id);
                if (ram == null)
                {
                    throw new Exception("RAM not found!");
                }
                return ram;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<RAM> CreateRAM(RAMDto rAMDto)
        {
            try
            {
                var existingRAM = await _dbContext.RAM.FirstOrDefaultAsync(t => t.RAMName == rAMDto.RAMName);
                if (existingRAM != null)
                {
                    throw new Exception("RAM Already Exists!");
                }
                var newRAM = new RAM
                {
                    RAMName = rAMDto.RAMName,
                };
                _dbContext.RAM.Add(newRAM);
                await _dbContext.SaveChangesAsync();
                return newRAM;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<RAM> UpdateRAM(int ramId, RAMDto rAMDto)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingRAM = await _dbContext.RAM.FindAsync(ramId);
                    if (existingRAM == null)
                    {
                        throw new Exception("RAM not found!");
                    }
                    existingRAM.RAMName = rAMDto.RAMName;

                    _dbContext.Entry(existingRAM).State = EntityState.Modified;

                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                    return existingRAM;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
        }
        public async Task<RAM> RemoveRAM(int ramId)
        {
            try
            {
                var ram = await _dbContext.RAM.FindAsync(ramId);
                if (ram == null)
                {
                    throw new Exception("RAM not found!");
                }

                _dbContext.RAM.Remove(ram);

                await _dbContext.SaveChangesAsync();

                return ram;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
    }
}
