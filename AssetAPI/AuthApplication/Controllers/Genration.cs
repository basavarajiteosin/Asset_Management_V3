using AssetManagementAPI.Services;
using AuthApplication.Models;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagementAPI.Controllers
{
    [ApiController]
    [Route("api/AssetManagement")]
    public class GenrationController : Controller
    {
        private readonly IGenrationService _genrationService;
        public GenrationController(IGenrationService ge)
        {
            _genrationService = ge;
        }

        [HttpGet("GetAllGenrationDetails")]
        public async Task<IActionResult> GetAllGenrationDetails()
        {
            try
            {
                var genrations = await _genrationService.GetAllGenrationDetails();
                return Json(new { success = true, message = "Successfully retrieved genration", data = genrations });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetGenrationDetailById")]
        public async Task<IActionResult> GetGenrationDetailById(int id)
        {
            try
            {
                var genration = await _genrationService.GetGenrationDetailById(id);
                if (genration == null)
                    return NotFound(new { success = false, message = "Genration not found" });

                return Ok(new { success = true, message = "Successfully retrieved Genration", data = genration });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateGenration")]
        public async Task<IActionResult> CreateGenration(GenrationDto genrationDto)
        {
            try
            {
                var createGenration= await _genrationService.CreateGenration(genrationDto);
                return CreatedAtAction(nameof(GetGenrationDetailById), new { id = createGenration.Id }, createGenration);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateGenration")]
        public async Task<IActionResult> UpdateGenration(int genrationId, GenrationDto genrationDto)
        {
            try
            {
                await _genrationService.UpdateGenration(genrationId, genrationDto);
                return Ok(new { success = true, message = "Genration updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("RemoveGenration")]
        public async Task<IActionResult> RemoveGenration(int id)
        {
            try
            {
                await _genrationService.RemoveGenration(id);
                return Ok(new { success = true, message = "Genration deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
