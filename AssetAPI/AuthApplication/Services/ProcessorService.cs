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
    public interface IProcessorService
    {
        Task<List<Processor>> GetAllProcessorDetails();
        Task<Processor> GetProcessorDetailById(int id);
        Task<Processor> CreateProcessor(ProcessorDto processorDto);
        Task<Processor> UpdateProcessor(int processorId, ProcessorDto processorDto);
        Task<Processor> RemoveProcessor(int processorId);
    }
    public class ProcessorService : IProcessorService
    {
        private readonly AuthAppContext _dbContext;
        private readonly IConfiguration _configuration;
        public ProcessorService(AuthAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public async Task<List<Processor>> GetAllProcessorDetails()
        {
            try
            {
                return await _dbContext.Processor.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve Processor " + ex.Message);
            }
        }
        public async Task<Processor> GetProcessorDetailById(int id)
        {
            try
            {
                var processor = await _dbContext.Processor.FindAsync(id);
                if (processor == null)
                {
                    throw new Exception("Processor not found!");
                }

                return processor;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<Processor> CreateProcessor(ProcessorDto processorDto)
        {
            try
            {
                var existingProcessor = await _dbContext.Processor.FirstOrDefaultAsync(t => t.ProcessorName == processorDto.ProcessorName);
                if (existingProcessor != null)
                {
                    throw new Exception("Processor Already Exists!");
                }

                var newProcessor = new Processor
                {
                    ProcessorName = processorDto.ProcessorName,

                };
                _dbContext.Processor.Add(newProcessor);
                await _dbContext.SaveChangesAsync();

                return newProcessor;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<Processor> UpdateProcessor(int processorId, ProcessorDto processorDto)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingProcessor = await _dbContext.Processor.FindAsync(processorId);
                    if (existingProcessor == null)
                    {
                        throw new Exception("Processor not found!");
                    }

                    existingProcessor.ProcessorName = processorDto.ProcessorName;


                    _dbContext.Entry(existingProcessor).State = EntityState.Modified;

                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                    return existingProcessor;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
        }
        public async Task<Processor> RemoveProcessor(int processorId)
        {
            try
            {
                var processor = await _dbContext.Processor.FindAsync(processorId);
                if (processor == null)
                {
                    throw new Exception("Processor not found!");
                }

                _dbContext.Processor.Remove(processor);

                await _dbContext.SaveChangesAsync();

                return processor;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
    }
}
