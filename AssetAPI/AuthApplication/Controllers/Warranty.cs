using AssetManagementAPI.Services;
using AuthApplication.Models;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagementAPI.Controllers
{
    [ApiController]
    [Route("api/AssetManagement")]
    public class WarrantyController : Controller
    {
        private readonly IWarrantyStatusService _warrantyStatusService;
        public WarrantyController(IWarrantyStatusService warrantyStatusService)
        {
            _warrantyStatusService = warrantyStatusService;
        }
        [HttpGet("GetAllWarrantyDDetails")]
        public async Task<IActionResult> GetAllWarrantyDDetails()
        {
            try
            {
                var hdd = await _warrantyStatusService.GetAllWarrantyDDetails();
                return Json(new { success = true, message = "Successfully retrieved Warranty", data = hdd });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetWarrantyDetailById")]
        public async Task<IActionResult> GetWarrantyDetailById(int id)
        {
            try
            {
                var ram = await _warrantyStatusService.GetWarrantyDetailById(id);
                if (ram == null)
                    return NotFound(new { success = false, message = "Warranty not found" });

                return Ok(new { success = true, message = "Successfully retrieved Warranty", data = ram });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateWarranty")]
        public async Task<IActionResult> CreateWarranty(WarrantyStatusDto hDDDto)
        {
            try
            {
                var createRAM = await _warrantyStatusService.CreateWarranty(hDDDto);
                return CreatedAtAction(nameof(GetWarrantyDetailById), new { id = createRAM.Id }, createRAM);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateWarranty")]
        public async Task<IActionResult> UpdateWarranty(int hddID, WarrantyStatusDto hDDDto)
        {
            try
            {
                await _warrantyStatusService.UpdateWarranty(hddID, hDDDto);
                return Ok(new { success = true, message = "Warranty updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("RemoveWarranty")]
        public async Task<IActionResult> RemoveWarranty(int id)
        {
            try
            {
                await _warrantyStatusService.RemoveWarranty(id);
                return Ok(new { success = true, message = "Warranty deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
