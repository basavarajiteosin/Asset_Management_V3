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
    public interface IModelService
    {
        Task<List<Models1>> GetAllModelsDetails();
        Task<Models1> GetModelDetailById(int id);
        Task<Models1> CreateModel(ModelsDto models);
        Task<Models1> UpdateModel(int modelId, ModelsDto models);
        Task<Models1> RemoveModel(int modelId);
    }

    public class ModelService : IModelService
    {
        private readonly AuthAppContext _dbContext;
        private readonly IConfiguration _configuration;
        public ModelService(AuthAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public async Task<List<Models1>> GetAllModelsDetails()
        {
            try
            {
                return await _dbContext.Models.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve Models " + ex.Message);
            }
        }
        public async Task<Models1> GetModelDetailById(int id)
        {
            try
            {
                var models = await _dbContext.Models.FindAsync(id);
                if (models == null)
                {
                    throw new Exception("Model not found!");
                }

                return models;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<Models1> CreateModel(ModelsDto models)
        {
            try
            {
                var existingModel = await _dbContext.Models.FirstOrDefaultAsync(t => t.ModelName == models.ModelName);
                if (existingModel != null)
                {
                    throw new Exception("Model Already Exists!");
                }

                var newModel = new Models1
                {
                    ModelName = models.ModelName,
                    AccetType=models.AccetType

                };
                _dbContext.Models.Add(newModel);
                await _dbContext.SaveChangesAsync();

                return newModel;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<Models1> UpdateModel(int modelId, ModelsDto models)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingModel = await _dbContext.Models.FindAsync(modelId);
                    if (existingModel == null)
                    {
                        throw new Exception("Asset type not found!");
                    }

                    existingModel.ModelName = models.ModelName;
                    existingModel.AccetType = models.AccetType;


                    _dbContext.Entry(existingModel).State = EntityState.Modified;

                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                    return existingModel;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
        }
        public async Task<Models1> RemoveModel(int modelId)
        {
            try
            {
                var model = await _dbContext.Models.FindAsync(modelId);
                if (model == null)
                {
                    throw new Exception("Model not found!");
                }

                _dbContext.Models.Remove(model);

                await _dbContext.SaveChangesAsync();

                return model;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
    }
}
