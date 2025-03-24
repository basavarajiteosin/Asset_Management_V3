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
    public interface IAccessoriesTypeService
    {
        Task<List<AccessoriesType>> GetAllAccessoriesTypeDetails();
        Task<AccessoriesType> GetAccessoriesTypeDetailById(int id);
        Task<AccessoriesType> CreateAccessoriesType(AccessoriesTypeDto accessoriesTypeDto);
        Task<AccessoriesType> UpdateAccessoriesType(int accessoriesId, AccessoriesTypeDto accessoriesTypeDto);
        Task<AccessoriesType> RemoveAccessoriesType(int accessoriesId);
    }
    public class AccessoriesTypeService : IAccessoriesTypeService
    {
        private readonly AuthAppContext _dbContext;
        private readonly IConfiguration _configuration;
        public AccessoriesTypeService(AuthAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public async Task<List<AccessoriesType>> GetAllAccessoriesTypeDetails()
        {
            try
            {
                return await _dbContext.AccessoriesType.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve AccessoriesType " + ex.Message);
            }
        }
        public async Task<AccessoriesType> GetAccessoriesTypeDetailById(int id)
        {
            try
            {
                var accessories = await _dbContext.AccessoriesType.FindAsync(id);
                if (accessories == null)
                {
                    throw new Exception("Accessories not found!");
                }
                return accessories;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<AccessoriesType> CreateAccessoriesType(AccessoriesTypeDto accessoriesTypeDto)
        {
            try
            {
                var existingAccessoriesType = await _dbContext.AccessoriesType.FirstOrDefaultAsync(t => t.AccessoriesTypeName == accessoriesTypeDto.AccessoriesTypeName);
                if (existingAccessoriesType != null)
                {
                    throw new Exception("AccessoriesType Already Exists!");
                }
                var newAccessoriesType = new AccessoriesType
                {
                    AccessoriesTypeName = accessoriesTypeDto.AccessoriesTypeName,
                };
                _dbContext.AccessoriesType.Add(newAccessoriesType);
                await _dbContext.SaveChangesAsync();
                return newAccessoriesType;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<AccessoriesType> UpdateAccessoriesType(int accessoriesId, AccessoriesTypeDto accessoriesTypeDto)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingAccessoriesType = await _dbContext.AccessoriesType.FindAsync(accessoriesId);
                    if (existingAccessoriesType == null)
                    {
                        throw new Exception("AccessoriesType  not found!");
                    }
                    existingAccessoriesType.AccessoriesTypeName = accessoriesTypeDto.AccessoriesTypeName;

                    _dbContext.Entry(existingAccessoriesType).State = EntityState.Modified;

                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                    return existingAccessoriesType;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
        }
        public async Task<AccessoriesType> RemoveAccessoriesType(int accessoriesId)
        {
            try
            {
                var accessoriesType = await _dbContext.AccessoriesType.FindAsync(accessoriesId);
                if (accessoriesType == null)
                {
                    throw new Exception("AccessoriesType not found!");
                }

                _dbContext.AccessoriesType.Remove(accessoriesType);

                await _dbContext.SaveChangesAsync();

                return accessoriesType;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
    }



}
