using AssetManagementAPI.Services;
using AuthApplication.Models;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagementAPI.Controllers
{
    [ApiController]
    [Route("api/AssetManagement")]
    public class OSController : Controller
    {
        private readonly IOSService _oSService;
        public OSController(IOSService oSService)
        {
            _oSService = oSService;
        }
        [HttpGet("GetAllOSDetails")]
        public async Task<IActionResult> GetAllOSDetails()
        {
            try
            {
                var hdd = await _oSService.GetAllOSDetails();
                return Json(new { success = true, message = "Successfully retrieved OS", data = hdd });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetOSDetailById")]
        public async Task<IActionResult> GetOSDetailById(int id)
        {
            try
            {
                var ram = await _oSService.GetOSDetailById(id);
                if (ram == null)
                    return NotFound(new { success = false, message = "OS not found" });

                return Ok(new { success = true, message = "Successfully retrieved OS", data = ram });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateOS")]
        public async Task<IActionResult> CreateOS(OSDto oSDto)
        {
            try
            {
                var createRAM = await _oSService.CreateOS(oSDto);
                return CreatedAtAction(nameof(GetOSDetailById), new { id = createRAM.Id }, createRAM);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateOS")]
        public async Task<IActionResult> UpdateOS(int hddID, OSDto hDDDto)
        {
            try
            {
                await _oSService.UpdateOS(hddID, hDDDto);
                return Ok(new { success = true, message = "OS updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("RemoveOS")]
        public async Task<IActionResult> RemoveOS(int id)
        {
            try
            {
                await _oSService.RemoveOS(id);
                return Ok(new { success = true, message = "OS deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
