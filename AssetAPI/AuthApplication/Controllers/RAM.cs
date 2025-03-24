using AssetManagementAPI.Services;
using AuthApplication.Models;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagementAPI.Controllers
{
    [ApiController]
    [Route("api/AssetManagement")]
    public class RAMController : Controller
    {
        private readonly IRAMService _ramService;
        public RAMController(IRAMService rAMService)
        {
            _ramService = rAMService;
        }
        [HttpGet("GetAllRAMDetails")]
        public async Task<IActionResult> GetAllRAMDetails()
        {
            try
            {
                var rAM = await _ramService.GetAllRAMDetails();
                return Json(new { success = true, message = "Successfully retrieved RAM", data = rAM });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetRAMDetailById")]
        public async Task<IActionResult> GetRAMDetailById(int id)
        {
            try
            {
                var ram = await _ramService.GetRAMDetailById(id);
                if (ram == null)
                    return NotFound(new { success = false, message = "RAM not found" });

                return Ok(new { success = true, message = "Successfully retrieved RAM", data = ram });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateRAM")]
        public async Task<IActionResult> CreateRAM(RAMDto rAMDto)
        {
            try
            {
                var createRAM = await _ramService.CreateRAM(rAMDto);
                return CreatedAtAction(nameof(GetRAMDetailById), new { id = createRAM.Id }, createRAM);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateRAM")]
        public async Task<IActionResult> UpdateRAM(int ramId, RAMDto rAMDto)
        {
            try
            {
                await _ramService.UpdateRAM(ramId, rAMDto);
                return Ok(new { success = true, message = "RAM updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("RemoveRAM")]
        public async Task<IActionResult> RemoveRAM(int id)
        {
            try
            {
                await _ramService.RemoveRAM(id);
                return Ok(new { success = true, message = "RAM deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

    }
}
