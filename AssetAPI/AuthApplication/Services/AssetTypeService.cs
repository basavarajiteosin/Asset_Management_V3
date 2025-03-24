using AuthApplication.DbContexts;
using AuthApplication.Models;
using Microsoft.EntityFrameworkCore;
using PMOAPIV2.Services;
using System.Diagnostics.Eventing.Reader;
using System.Text;
using System.Threading.Tasks;

namespace AssetManagementAPI.Services
{
    public interface IAssetTypeService
    {
        Task<List<AssetType>> GetAllAssetTypeDetails();
        Task<AssetType> GetAssetTypeDetailById(int id);
        Task<AssetType> CreateAssetType(AssetTypeDto assetType);
        Task<AssetType> UpdateAssetType(int assetTypeId, AssetTypeDto assetType);
        Task<AssetType> RemoveAssetType(int assetTypeId);
    }
    public class AssetTypeService : IAssetTypeService
    {
        private readonly AuthAppContext _dbContext;
        private readonly IConfiguration _configuration;
        public AssetTypeService(AuthAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }
        public async Task<List<AssetType>> GetAllAssetTypeDetails()
        {
            try
            {
                return await _dbContext.AssetType.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve Asset Type: " + ex.Message);
            }
        }
        public async Task<AssetType> GetAssetTypeDetailById(int id)
        {
            try
            {
                var device = await _dbContext.AssetType.FindAsync(id);
                if (device == null)
                {
                    throw new Exception("Asset Type not found!");
                }

                return device;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<AssetType> CreateAssetType(AssetTypeDto assetType)
        {
            try
            {
                var existingAssetType = await _dbContext.AssetType.FirstOrDefaultAsync(t => t.AssetTypeName ==assetType.AssetTypeName);
                if (existingAssetType != null)
                {
                    throw new Exception("Asset type Already Exists!");
                }

                var newAssetType = new AssetType
                {
                    AssetTypeName = assetType.AssetTypeName,
                   
                };
                _dbContext.AssetType.Add(newAssetType);
                await _dbContext.SaveChangesAsync();

                return newAssetType;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<AssetType> UpdateAssetType(int assetTypeId, AssetTypeDto assetType)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingAssetType = await _dbContext.AssetType.FindAsync(assetTypeId);
                    if (existingAssetType == null)
                    {
                        throw new Exception("Asset type not found!");
                    }

                    existingAssetType.AssetTypeName = assetType.AssetTypeName;
                 

                    _dbContext.Entry(existingAssetType).State = EntityState.Modified;

                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                    return existingAssetType;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
        }
        public async Task<AssetType> RemoveAssetType(int id)
        {
            try
            {
                var device = await _dbContext.AssetType.FindAsync(id);
                if (device == null)
                {
                    throw new Exception("Asset Type not found!");
                }

                _dbContext.AssetType.Remove(device);

                await _dbContext.SaveChangesAsync();

                return device;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
    }
}
