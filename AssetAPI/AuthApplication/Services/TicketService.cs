using AuthApplication.DbContexts;
using AuthApplication.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Services
{
    public interface ITicketService
    {
        Task<Tickets> CreateTicket(TicketDto ticketDto);
        Task<Tickets> UpdateTicket(int ticketId, TicketDto ticketDto);
        Task<Tickets> DeleteTicket(int ticketId);
        Task<List<TicketsView>> GetAllTickets(); // New method
        Task<List<TicketsView>> GetAllTicketsByCreatedBy(string createdBy); // New method
        Task<List<TicketsView>> GetTicketsBasedOnStatus(TicketStatusEnum status); // New method
        Task<TicketsView> GetTicketById(int ticketId); // New method
    }
    public class TicketService : ITicketService
    {
        private readonly AuthAppContext _dbContext;
        private readonly IConfiguration _configuration;

        public TicketService(AuthAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }


        public async Task<List<TicketsView>> GetAllTickets()
        {
            try
            {
                var tickets = await _dbContext.Tickets
                    .ToListAsync();

                var ticketsViewList = new List<TicketsView>();
                foreach (var ticket in tickets)
                {
                    var attachments = await _dbContext.TicketAttachments
                        .Where(a => a.TicketId == ticket.TicketId)
                        .ToListAsync();

                    var ticketView = new TicketsView
                    {
                        TicketId = ticket.TicketId,
                        AssignedUser = ticket.AssignedUser,
                        TicketType = ticket.TicketType,
                        IssueType = ticket.IssueType,
                        IssueSubject = ticket.IssueSubject,
                        IssueDescription = ticket.IssueDescription,
                        AssignerRemarks = ticket.AssignerRemarks,
                        TicketStatus = ticket.TicketStatus,
                        CreatedOn = ticket.CreatedOn,
                        CreatedBy = ticket.CreatedBy,
                        ModifiedOn = ticket.ModifiedOn,
                        ModifiedBy = ticket.ModifiedBy,
                        TicketAttachments = attachments // Map attachments to the view model
                    };

                    ticketsViewList.Add(ticketView);
                }

                return ticketsViewList;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve tickets: " + ex.Message);
            }
        }
        public async Task<List<TicketsView>> GetTicketsBasedOnStatus(TicketStatusEnum status)
        {
            try
            {
                var tickets = await _dbContext.Tickets
                    .Where(t => t.TicketStatus == status)
                    .ToListAsync();

                var ticketsViewList = new List<TicketsView>();
                foreach (var ticket in tickets)
                {
                    var attachments = await _dbContext.TicketAttachments
                        .Where(a => a.TicketId == ticket.TicketId)
                        .ToListAsync();

                    var ticketView = new TicketsView
                    {
                        TicketId = ticket.TicketId,
                        AssignedUser = ticket.AssignedUser,
                        TicketType = ticket.TicketType,
                        IssueType = ticket.IssueType,
                        IssueSubject = ticket.IssueSubject,
                        IssueDescription = ticket.IssueDescription,
                        AssignerRemarks = ticket.AssignerRemarks,
                        TicketStatus = ticket.TicketStatus,
                        CreatedOn = ticket.CreatedOn,
                        CreatedBy = ticket.CreatedBy,
                        ModifiedOn = ticket.ModifiedOn,
                        ModifiedBy = ticket.ModifiedBy,
                        TicketAttachments = attachments // Map attachments to the view model
                    };

                    ticketsViewList.Add(ticketView);
                }

                return ticketsViewList;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve tickets by status: " + ex.Message);
            }
        }
        public async Task<List<TicketsView>> GetAllTicketsByCreatedBy(string createdBy)
        {
            try
            {
                if (string.IsNullOrEmpty(createdBy))
                {
                    throw new Exception("CreatedBy parameter cannot be empty!");
                }

                var tickets = await _dbContext.Tickets
                    .Where(t => t.CreatedBy == createdBy)
                    .ToListAsync();

                var ticketsViewList = new List<TicketsView>();
                foreach (var ticket in tickets)
                {
                    var attachments = await _dbContext.TicketAttachments
                        .Where(a => a.TicketId == ticket.TicketId)
                        .ToListAsync();

                    var ticketView = new TicketsView
                    {
                        TicketId = ticket.TicketId,
                        AssignedUser = ticket.AssignedUser,
                        TicketType = ticket.TicketType,
                        IssueType = ticket.IssueType,
                        IssueSubject = ticket.IssueSubject,
                        IssueDescription = ticket.IssueDescription,
                        AssignerRemarks = ticket.AssignerRemarks,
                        TicketStatus = ticket.TicketStatus,
                        CreatedOn = ticket.CreatedOn,
                        CreatedBy = ticket.CreatedBy,
                        ModifiedOn = ticket.ModifiedOn,
                        ModifiedBy = ticket.ModifiedBy,
                        TicketAttachments = attachments // Map attachments to the view model
                    };

                    ticketsViewList.Add(ticketView);
                }

                return ticketsViewList;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve tickets by creator: " + ex.Message);
            }
        }

        public async Task<TicketsView> GetTicketById(int ticketId)
        {
            try
            {
                var ticket = await _dbContext.Tickets
                    .FirstOrDefaultAsync(t => t.TicketId == ticketId);

                if (ticket == null)
                {
                    throw new Exception("Ticket not found!");
                }

                // Fetch related attachments
                var attachments = await _dbContext.TicketAttachments
                    .Where(a => a.TicketId == ticket.TicketId)
                    .ToListAsync();

                // Map to TicketsView
                var ticketView = new TicketsView
                {
                    TicketId = ticket.TicketId,
                    AssignedUser = ticket.AssignedUser,
                    TicketType = ticket.TicketType,
                    IssueType = ticket.IssueType,
                    IssueSubject = ticket.IssueSubject,
                    IssueDescription = ticket.IssueDescription,
                    AssignerRemarks = ticket.AssignerRemarks,
                    TicketStatus = ticket.TicketStatus,
                    CreatedOn = ticket.CreatedOn,
                    CreatedBy = ticket.CreatedBy,
                    ModifiedOn = ticket.ModifiedOn,
                    ModifiedBy = ticket.ModifiedBy,
                    TicketAttachments = attachments // Include attachments
                };

                return ticketView;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve ticket: " + ex.Message);
            }
        }

        public async Task<Tickets> CreateTicket(TicketDto ticketDto)
        {
            try
            {
                var existingTicket = await _dbContext.Tickets
            .FirstOrDefaultAsync(t => t.IssueSubject == ticketDto.IssueSubject && t.CreatedBy == ticketDto.CreatedBy);

                if (existingTicket != null)
                {
                    // If the existing ticket's status is not Resolved (3), throw an error
                    if (existingTicket.TicketStatus != TicketStatusEnum.Closed) // 3 = Resolved
                    {
                        throw new Exception("A ticket with this subject already exists and is not resolved!");
                    }
                    // If status is Resolved (3), proceed to create a new ticket
                }

                // Create new ticket
                var newTicket = new Tickets
                {
                    AssignedUser = ticketDto.AssignedUser,
                    TicketType = ticketDto.TicketType,
                    IssueType = ticketDto.IssueType,
                    IssueSubject = ticketDto.IssueSubject,
                    IssueDescription = ticketDto.IssueDescription,
                    AssignerRemarks = ticketDto.AssignerRemarks,
                    TicketStatus = ticketDto.TicketStatus,
                    CreatedBy = ticketDto.CreatedBy,
                    CreatedOn = DateTime.UtcNow
                };

                _dbContext.Tickets.Add(newTicket);
                await _dbContext.SaveChangesAsync();

                var ticketId = newTicket.TicketId;

                // Handle file attachments
                string folderPath = _configuration["FolderPath2"];
                string portalAddress = _configuration["ApiURL"];
                string folderName = "/ProfileAttachemants/TicketAttachments/";

                if (ticketDto.TicketAttchment != null && ticketDto.TicketAttchment.Count > 0)
                {
                    Directory.CreateDirectory(folderPath); // Ensure directory exists

                    foreach (var file in ticketDto.TicketAttchment)
                    {
                        if (file.Length > 0)
                        {
                            var fileName = $"{Guid.NewGuid()}_{file.FileName.Replace(" ", "_")}";
                            var filePath = Path.Combine(folderPath, fileName);
                            string dbFilePath = portalAddress + Path.Combine(folderName, fileName);

                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {
                                await file.CopyToAsync(stream);
                            }

                            var attachment = new TicketAttachment
                            {
                                TicketId = ticketId,
                                AttachmentFilePath = filePath,
                                DocumentName = file.FileName,
                                AttachmentServerPath = dbFilePath,
                                CreatedBy = ticketDto.CreatedBy,
                                CreatedOn = DateTime.Now
                            };

                            _dbContext.TicketAttachments.Add(attachment);
                        }
                    }
                    await _dbContext.SaveChangesAsync();
                }

                return newTicket;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<Tickets> UpdateTicket(int ticketId, TicketDto ticketDto)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingTicket = await _dbContext.Tickets.FindAsync(ticketId);
                    if (existingTicket == null)
                    {
                        throw new Exception("Ticket not found!");
                    }

                    // Update ticket details
                    existingTicket.AssignedUser = ticketDto.AssignedUser;
                    existingTicket.TicketType = ticketDto.TicketType;
                    existingTicket.IssueType = ticketDto.IssueType;
                    existingTicket.IssueSubject = ticketDto.IssueSubject;
                    existingTicket.IssueDescription = ticketDto.IssueDescription;
                    existingTicket.AssignerRemarks = ticketDto.AssignerRemarks;
                    existingTicket.TicketStatus = ticketDto.TicketStatus;
                    existingTicket.ModifiedBy = ticketDto.CreatedBy; // Assuming CreatedBy acts as ModifiedBy
                    if (existingTicket.TicketStatus == TicketStatusEnum.Closed)
                    {
                        existingTicket.ModifiedOn = DateTime.Now;

                    }
                    _dbContext.Entry(existingTicket).State = EntityState.Modified;

                    // Handle file attachments
                    string folderPath = _configuration["FolderPath2"];
                    string portalAddress = _configuration["ApiURL"];
                    string folderName = "/ProfileAttachemants/TicketAttachments/";

                    if (ticketDto.TicketAttchment != null && ticketDto.TicketAttchment.Count > 0)
                    {
                        Directory.CreateDirectory(folderPath);

                        foreach (var file in ticketDto.TicketAttchment)
                        {
                            if (file.Length > 0)
                            {
                                var fileName = $"{Guid.NewGuid()}_{file.FileName.Replace(" ", "_")}";
                                var filePath = Path.Combine(folderPath, fileName);
                                string dbFilePath = portalAddress + Path.Combine(folderName, fileName);

                                using (var stream = new FileStream(filePath, FileMode.Create))
                                {
                                    await file.CopyToAsync(stream);
                                }

                                var attachment = new TicketAttachment
                                {
                                    TicketId = ticketId,
                                    AttachmentFilePath = filePath,
                                    DocumentName = file.FileName,
                                    AttachmentServerPath = dbFilePath,
                                    CreatedBy = ticketDto.CreatedBy,
                                    CreatedOn = DateTime.UtcNow
                                };

                                _dbContext.TicketAttachments.Add(attachment);
                            }
                        }
                    }

                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                    return existingTicket;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
        }

        public async Task<Tickets> DeleteTicket(int ticketId)
        {
            try
            {
                var ticket = await _dbContext.Tickets // Include attachments for deletion
                    .FirstOrDefaultAsync(t => t.TicketId == ticketId);

                if (ticket == null)
                {
                    throw new Exception("Ticket not found!");
                }

                var ticketAttachments = await _dbContext.TicketAttachments
                    .Where(t => t.TicketId == ticketId) // Get all attachments for the given ticketId
                    .ToListAsync();

                // Delete associated attachments from file system and database
                if (ticketAttachments.Any())
                {
                    foreach (var attachment in ticketAttachments)
                    {
                        if (File.Exists(attachment.AttachmentFilePath))
                        {
                            File.Delete(attachment.AttachmentFilePath);
                        }
                        _dbContext.TicketAttachments.Remove(attachment);
                    }
                }

                _dbContext.Tickets.Remove(ticket);
                await _dbContext.SaveChangesAsync();

                return ticket;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

    }
}
