using AssetManagementAPI.Services;
using AuthApplication.Models;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagementAPI.Controllers
{
    [ApiController]
    [Route("api/AssetManagement")]
    public class ChargerTypeController : Controller
    {
        private readonly IChargerTypeService _chargerTypeService;
        public ChargerTypeController(IChargerTypeService chargerService)
        {
            _chargerTypeService = chargerService;
        }
        [HttpGet("GetAllChargerTypeDetails")]
        public async Task<IActionResult> GetAllChargerTypeDetails()
        {
            try
            {
                var hdd = await _chargerTypeService.GetAllChargerTypeDetails();
                return Json(new { success = true, message = "Successfully retrieved Charger Type", data = hdd });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetChargerTypeDetailById")]
        public async Task<IActionResult> GetChargerTypeDetailById(int id)
        {
            try
            {
                var ram = await _chargerTypeService.GetChargerTypeDetailById(id);
                if (ram == null)
                    return NotFound(new { success = false, message = "Charger Type not found" });

                return Ok(new { success = true, message = "Successfully retrieved Charger Type", data = ram });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateChargerType")]
        public async Task<IActionResult> CreateChargerType(ChargerTypeDto oSDto)
        {
            try
            {
                var createRAM = await _chargerTypeService.CreateChargerType(oSDto);
                return CreatedAtAction(nameof(GetChargerTypeDetailById), new { id = createRAM.Id }, createRAM);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateChargerType")]
        public async Task<IActionResult> UpdateChargerType(int hddID, ChargerTypeDto hDDDto)
        {
            try
            {
                await _chargerTypeService.UpdateChargerType(hddID, hDDDto);
                return Ok(new { success = true, message = "Charger Type updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("RemoveChargerType")]
        public async Task<IActionResult> RemoveChargerType(int id)
        {
            try
            {
                await _chargerTypeService.RemoveChargerType(id);
                return Ok(new { success = true, message = "Charger Type deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
