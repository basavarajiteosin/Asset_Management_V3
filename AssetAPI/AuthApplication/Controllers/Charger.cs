using AssetManagementAPI.Services;
using AuthApplication.Models;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagementAPI.Controllers
{
    [ApiController]
    [Route("api/AssetManagement")]
    public class ChargerController : Controller
    {
        private readonly IChargerService _chargerService;
        public ChargerController(IChargerService chargerService)
        {
            _chargerService = chargerService;
        }
        [HttpGet("GetAllChargerDetails")]
        public async Task<IActionResult> GetAllChargerDetails()
        {
            try
            {
                var hdd = await _chargerService.GetAllChargerDetails();
                return Json(new { success = true, message = "Successfully retrieved Charger", data = hdd });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetChargerDetailById")]
        public async Task<IActionResult> GetChargerDetailById(int id)
        {
            try
            {
                var ram = await _chargerService.GetChargerDetailById(id);
                if (ram == null)
                    return NotFound(new { success = false, message = "Charger not found" });

                return Ok(new { success = true, message = "Successfully retrieved Charger", data = ram });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateCharger")]
        public async Task<IActionResult> CreateCharger(ChargerDto oSDto)
        {
            try
            {
                var createRAM = await _chargerService.CreateCharger(oSDto);
                return CreatedAtAction(nameof(GetChargerDetailById), new { id = createRAM.Id }, createRAM);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateCharger")]
        public async Task<IActionResult> UpdateCharger(int hddID,ChargerDto hDDDto)
        {
            try
            {
                await _chargerService.UpdateCharger(hddID, hDDDto);
                return Ok(new { success = true, message = "Charger updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("RemoveCharger")]
        public async Task<IActionResult> RemoveCharger(int id)
        {
            try
            {
                await _chargerService.RemoveCharger(id);
                return Ok(new { success = true, message = "Charger deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
