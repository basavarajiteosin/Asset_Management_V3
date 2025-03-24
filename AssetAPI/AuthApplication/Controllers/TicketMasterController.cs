using AssetManagement.Services;
using AuthApplication.Models;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketMasterController : Controller
    {
        private readonly ITicketMasterService _ticketTypeService;

        public TicketMasterController(ITicketMasterService ticketTypeService)
        {
            _ticketTypeService = ticketTypeService;
        }

        [HttpGet("GetAllTicketTypes")]
        public async Task<IActionResult> GetAllTicketTypes()
        {
            try
            {
                var ticketTypes = await _ticketTypeService.GetAllTicketTypes();
                return Json(new { success = true, message = "Successfully retrieved ticket types", data = ticketTypes });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetTicketTypeById")]
        public async Task<IActionResult> GetTicketTypeById(int id)
        {
            try
            {
                var ticketType = await _ticketTypeService.GetTicketTypeById(id);
                if (ticketType == null)
                    return NotFound(new { success = false, message = "Ticket type not found" });

                return Ok(new { success = true, message = "Successfully retrieved ticket type", data = ticketType });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateTicketType")]
        public async Task<IActionResult> CreateTicketType([FromBody] TicketTypeDto ticketTypeDto)
        {
            try
            {
                var createdTicketType = await _ticketTypeService.CreateTicketType(ticketTypeDto);
                return CreatedAtAction(nameof(GetTicketTypeById), new { id = createdTicketType.TTId }, createdTicketType);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateTicketType")]
        public async Task<IActionResult> UpdateTicketType(int ttId, [FromBody] TicketTypeDto ticketTypeDto)
        {
            try
            {
                await _ticketTypeService.UpdateTicketType(ttId, ticketTypeDto);
                return Ok(new { success = true, message = "Ticket type updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("RemoveTicketType")]
        public async Task<IActionResult> RemoveTicketType(int id)
        {
            try
            {
                await _ticketTypeService.RemoveTicketType(id);
                return Ok(new { success = true, message = "Ticket type deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetAllHardwareTypes")]
        public async Task<IActionResult> GetAllHardwareTypes()
        {
            try
            {
                var hardwareTypes = await _ticketTypeService.GetAllHardwareTypes();
                return Json(new { success = true, message = "Successfully retrieved hardware types", data = hardwareTypes });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetHardwareTypeById")]
        public async Task<IActionResult> GetHardwareTypeById(int id)
        {
            try
            {
                var hardwareType = await _ticketTypeService.GetHardwareTypeById(id);
                if (hardwareType == null)
                    return NotFound(new { success = false, message = "Hardware type not found" });

                return Ok(new { success = true, message = "Successfully retrieved hardware type", data = hardwareType });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateHardwareType")]
        public async Task<IActionResult> CreateHardwareType([FromBody] HardwareTypeDto hardwareTypeDto)
        {
            try
            {
                var createdHardwareType = await _ticketTypeService.CreateHardwareType(hardwareTypeDto);
                return CreatedAtAction(nameof(GetHardwareTypeById), new { id = createdHardwareType.HTId }, createdHardwareType);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateHardwareType")]
        public async Task<IActionResult> UpdateHardwareType(int htId, [FromBody] HardwareTypeDto hardwareTypeDto)
        {
            try
            {
                await _ticketTypeService.UpdateHardwareType(htId, hardwareTypeDto);
                return Ok(new { success = true, message = "Hardware type updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("RemoveHardwareType")]
        public async Task<IActionResult> RemoveHardwareType(int id)
        {
            try
            {
                await _ticketTypeService.RemoveHardwareType(id);
                return Ok(new { success = true, message = "Hardware type deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetAllSoftwareTypes")]
        public async Task<IActionResult> GetAllSoftwareTypes()
        {
            try
            {
                var softwareTypes = await _ticketTypeService.GetAllSoftwareTypes();
                return Json(new { success = true, message = "Successfully retrieved software types", data = softwareTypes });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetSoftwareTypeById")]
        public async Task<IActionResult> GetSoftwareTypeById(int id)
        {
            try
            {
                var softwareType = await _ticketTypeService.GetSoftwareTypeById(id);
                if (softwareType == null)
                    return NotFound(new { success = false, message = "Software type not found" });

                return Ok(new { success = true, message = "Successfully retrieved software type", data = softwareType });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateSoftwareType")]
        public async Task<IActionResult> CreateSoftwareType([FromBody] SoftwareTypeDto softwareTypeDto)
        {
            try
            {
                var createdSoftwareType = await _ticketTypeService.CreateSoftwareType(softwareTypeDto);
                return CreatedAtAction(nameof(GetSoftwareTypeById), new { id = createdSoftwareType.STId }, createdSoftwareType);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateSoftwareType")]
        public async Task<IActionResult> UpdateSoftwareType(int stId, [FromBody] SoftwareTypeDto softwareTypeDto)
        {
            try
            {
                await _ticketTypeService.UpdateSoftwareType(stId, softwareTypeDto);
                return Ok(new { success = true, message = "Software type updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("RemoveSoftwareType")]
        public async Task<IActionResult> RemoveSoftwareType(int id)
        {
            try
            {
                await _ticketTypeService.RemoveSoftwareType(id);
                return Ok(new { success = true, message = "Software type deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
