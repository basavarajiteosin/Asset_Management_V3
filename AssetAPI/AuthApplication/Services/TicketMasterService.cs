using AuthApplication.DbContexts;
using AuthApplication.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Services
{
    public interface ITicketMasterService
    {
        Task<List<TicketType>> GetAllTicketTypes();
        Task<TicketType> GetTicketTypeById(int id);
        Task<TicketType> CreateTicketType(TicketTypeDto ticketTypeDto);
        Task<TicketType> UpdateTicketType(int ttId, TicketTypeDto ticketTypeDto);
        Task<TicketType> RemoveTicketType(int ttId);

        Task<List<HardwareType>> GetAllHardwareTypes();
        Task<HardwareType> GetHardwareTypeById(int id);
        Task<HardwareType> CreateHardwareType(HardwareTypeDto hardwareTypeDto);
        Task<HardwareType> UpdateHardwareType(int htId, HardwareTypeDto hardwareTypeDto);
        Task<HardwareType> RemoveHardwareType(int htId);

        Task<List<SoftwareType>> GetAllSoftwareTypes();
        Task<SoftwareType> GetSoftwareTypeById(int id);
        Task<SoftwareType> CreateSoftwareType(SoftwareTypeDto softwareTypeDto);
        Task<SoftwareType> UpdateSoftwareType(int stId, SoftwareTypeDto softwareTypeDto);
        Task<SoftwareType> RemoveSoftwareType(int stId);
    }
    public class TicketMasterService : ITicketMasterService
    {
        private readonly AuthAppContext _dbContext;
        private readonly IConfiguration _configuration;

        public TicketMasterService(AuthAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public async Task<List<TicketType>> GetAllTicketTypes()
        {
            try
            {
                return await _dbContext.TicketTypes.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve ticket types: " + ex.Message);
            }
        }

        public async Task<TicketType> GetTicketTypeById(int id)
        {
            try
            {
                var ticketType = await _dbContext.TicketTypes.FindAsync(id);
                if (ticketType == null)
                {
                    throw new Exception("Ticket type not found!");
                }
                return ticketType;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<TicketType> CreateTicketType(TicketTypeDto ticketTypeDto)
        {
            try
            {
                var existingTicketType = await _dbContext.TicketTypes
                    .FirstOrDefaultAsync(t => t.TicketTypeName == ticketTypeDto.TicketTypeName);
                if (existingTicketType != null)
                {
                    throw new Exception("Ticket type already exists!");
                }

                var newTicketType = new TicketType
                {
                    TicketTypeName = ticketTypeDto.TicketTypeName
                };
                _dbContext.TicketTypes.Add(newTicketType);
                await _dbContext.SaveChangesAsync();
                return newTicketType;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<TicketType> UpdateTicketType(int ttId, TicketTypeDto ticketTypeDto)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingTicketType = await _dbContext.TicketTypes.FindAsync(ttId);
                    if (existingTicketType == null)
                    {
                        throw new Exception("Ticket type not found!");
                    }
                    existingTicketType.TicketTypeName = ticketTypeDto.TicketTypeName;

                    _dbContext.Entry(existingTicketType).State = EntityState.Modified;
                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                    return existingTicketType;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
        }

        public async Task<TicketType> RemoveTicketType(int ttId)
        {
            try
            {
                var ticketType = await _dbContext.TicketTypes.FindAsync(ttId);
                if (ticketType == null)
                {
                    throw new Exception("Ticket type not found!");
                }

                _dbContext.TicketTypes.Remove(ticketType);
                await _dbContext.SaveChangesAsync();
                return ticketType;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<List<HardwareType>> GetAllHardwareTypes()
        {
            try
            {
                return await _dbContext.HardwareTypes.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve hardware types: " + ex.Message);
            }
        }

        public async Task<HardwareType> GetHardwareTypeById(int id)
        {
            try
            {
                var hardwareType = await _dbContext.HardwareTypes.FindAsync(id);
                if (hardwareType == null)
                {
                    throw new Exception("Hardware type not found!");
                }
                return hardwareType;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<HardwareType> CreateHardwareType(HardwareTypeDto hardwareTypeDto)
        {
            try
            {
                var existingHardwareType = await _dbContext.HardwareTypes
                    .FirstOrDefaultAsync(t => t.HardwareTypeName == hardwareTypeDto.HardwareTypeName);
                if (existingHardwareType != null)
                {
                    throw new Exception("Hardware type already exists!");
                }

                var newHardwareType = new HardwareType
                {
                    HardwareTypeName = hardwareTypeDto.HardwareTypeName
                };
                _dbContext.HardwareTypes.Add(newHardwareType);
                await _dbContext.SaveChangesAsync();
                return newHardwareType;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<HardwareType> UpdateHardwareType(int htId, HardwareTypeDto hardwareTypeDto)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingHardwareType = await _dbContext.HardwareTypes.FindAsync(htId);
                    if (existingHardwareType == null)
                    {
                        throw new Exception("Hardware type not found!");
                    }
                    existingHardwareType.HardwareTypeName = hardwareTypeDto.HardwareTypeName;

                    _dbContext.Entry(existingHardwareType).State = EntityState.Modified;
                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                    return existingHardwareType;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
        }

        public async Task<HardwareType> RemoveHardwareType(int htId)
        {
            try
            {
                var hardwareType = await _dbContext.HardwareTypes.FindAsync(htId);
                if (hardwareType == null)
                {
                    throw new Exception("Hardware type not found!");
                }

                _dbContext.HardwareTypes.Remove(hardwareType);
                await _dbContext.SaveChangesAsync();
                return hardwareType;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<List<SoftwareType>> GetAllSoftwareTypes()
        {
            try
            {
                return await _dbContext.SoftwareTypes.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve software types: " + ex.Message);
            }
        }

        public async Task<SoftwareType> GetSoftwareTypeById(int id)
        {
            try
            {
                var softwareType = await _dbContext.SoftwareTypes.FindAsync(id);
                if (softwareType == null)
                {
                    throw new Exception("Software type not found!");
                }
                return softwareType;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<SoftwareType> CreateSoftwareType(SoftwareTypeDto softwareTypeDto)
        {
            try
            {
                var existingSoftwareType = await _dbContext.SoftwareTypes
                    .FirstOrDefaultAsync(t => t.SoftwareTypeName == softwareTypeDto.SoftwareTypeName);
                if (existingSoftwareType != null)
                {
                    throw new Exception("Software type already exists!");
                }

                var newSoftwareType = new SoftwareType
                {
                    SoftwareTypeName = softwareTypeDto.SoftwareTypeName
                };
                _dbContext.SoftwareTypes.Add(newSoftwareType);
                await _dbContext.SaveChangesAsync();
                return newSoftwareType;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<SoftwareType> UpdateSoftwareType(int stId, SoftwareTypeDto softwareTypeDto)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingSoftwareType = await _dbContext.SoftwareTypes.FindAsync(stId);
                    if (existingSoftwareType == null)
                    {
                        throw new Exception("Software type not found!");
                    }
                    existingSoftwareType.SoftwareTypeName = softwareTypeDto.SoftwareTypeName;

                    _dbContext.Entry(existingSoftwareType).State = EntityState.Modified;
                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                    return existingSoftwareType;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
        }

        public async Task<SoftwareType> RemoveSoftwareType(int stId)
        {
            try
            {
                var softwareType = await _dbContext.SoftwareTypes.FindAsync(stId);
                if (softwareType == null)
                {
                    throw new Exception("Software type not found!");
                }

                _dbContext.SoftwareTypes.Remove(softwareType);
                await _dbContext.SaveChangesAsync();
                return softwareType;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }


    }
}
