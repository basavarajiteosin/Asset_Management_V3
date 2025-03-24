using AssetManagement.Services;
using AuthApplication.Models;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly ITicketService _ticketService;

        public TicketsController(ITicketService ticketService)
        {
            _ticketService = ticketService;
        }


        [HttpGet("GetAllTickets")]
        public async Task<IActionResult> GetAllTickets()
        {
            try
            {
                var tickets = await _ticketService.GetAllTickets();
                return Ok(new { success = true, message = "Successfully retrieved all tickets", data = tickets });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetAllTicketsByCreatedBy")]
        public async Task<IActionResult> GetAllTicketsByCreatedBy(string createdBy)
        {
            try
            {
                var tickets = await _ticketService.GetAllTicketsByCreatedBy(createdBy);
                if (tickets == null || tickets.Count == 0)
                {
                    return Ok(new { success = true, message = "No tickets found for this creator", data = new object[] { } });
                }
                return Ok(new { success = true, message = "Successfully retrieved tickets by creator", data = tickets });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetTicketsBasedOnStatus")]
        public async Task<IActionResult> GetTicketsBasedOnStatus(TicketStatusEnum status)
        {
            try
            {
                var tickets = await _ticketService.GetTicketsBasedOnStatus(status);
                if (tickets == null || tickets.Count == 0)
                {
                    return Ok(new { success = true, message = $"No tickets found with status {status}", data = new object[] { } });
                }
                return Ok(new { success = true, message = $"Successfully retrieved tickets with status {status}", data = tickets });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateTicket")]
        public async Task<IActionResult> CreateTicket([FromForm] TicketDto ticketDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Invalid input data" });
                }

                var createdTicket = await _ticketService.CreateTicket(ticketDto);
                return CreatedAtAction(nameof(GetTicketById), new { id = createdTicket.TicketId }, createdTicket);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateTicket")]
        public async Task<IActionResult> UpdateTicket(int ticketId, [FromForm] TicketDto ticketDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Invalid input data" });
                }

                await _ticketService.UpdateTicket(ticketId, ticketDto);
                return Ok(new { success = true, message = "Ticket updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("DeleteTicket")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            try
            {
                await _ticketService.DeleteTicket(id);
                return Ok(new { success = true, message = "Ticket deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetTicketById")]
        public async Task<IActionResult> GetTicketById(int ticketId)
        {
            try
            {
                var ticket = await _ticketService.GetTicketById(ticketId);
                if (ticket == null)
                {
                    return NotFound(new { success = false, message = "Ticket not found" });
                }
                return Ok(new { success = true, message = "Successfully retrieved ticket", data = ticket });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
