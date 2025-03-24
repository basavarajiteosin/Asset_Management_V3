using AssetManagementAPI.Services;
using AuthApplication.Models;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagementAPI.Controllers
{
    [ApiController]
    [Route("api/AssetManagement")]
    public class HDDController : Controller
    {
        private readonly IHDDService _hddService;
        public HDDController(IHDDService hDDService)
        {
            _hddService = hDDService;
        }
        [HttpGet("GetAllHDDDetails")]
        public async Task<IActionResult> GetAllHDDDetails()
        {
            try
            {
                var hdd = await _hddService.GetAllHDDDetails();
                return Json(new { success = true, message = "Successfully retrieved HDD", data = hdd });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetHDDDetailById")]
        public async Task<IActionResult> GetHDDDetailById(int id)
        {
            try
            {
                var ram = await _hddService.GetHDDDetailById(id);
                if (ram == null)
                    return NotFound(new { success = false, message = "HDD not found" });

                return Ok(new { success = true, message = "Successfully retrieved HDD", data = ram });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateHDD")]
        public async Task<IActionResult> CreateHDD(HDDDto hDDDto)
        {
            try
            {
                var createRAM = await _hddService.CreateHDD(hDDDto);
                return CreatedAtAction(nameof(GetHDDDetailById), new { id = createRAM.Id }, createRAM);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateHDD")]
        public async Task<IActionResult> UpdateHDD(int hddID, HDDDto hDDDto)
        {
            try
            {
                await _hddService.UpdateHDD(hddID,hDDDto);
                return Ok(new { success = true, message = "HDD updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("RemoveHDD")]
        public async Task<IActionResult> RemoveHDD(int id)
        {
            try
            {
                await _hddService.RemoveHDD(id);
                return Ok(new { success = true, message = "HDD deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

    }
}
