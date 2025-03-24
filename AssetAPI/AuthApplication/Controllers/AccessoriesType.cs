using AssetManagementAPI.Services;
using AuthApplication.Models;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagementAPI.Controllers
{
    [ApiController]
    [Route("api/AssetManagement")]
    public class AccessoriesTypeController : Controller
    {
        private readonly IAccessoriesTypeService _accessoriesTypeService;
        public AccessoriesTypeController(IAccessoriesTypeService accessoriesTypeService)
        {
            _accessoriesTypeService = accessoriesTypeService;
        }


        [HttpGet("GetAllAccessoriesTypeDetails")]
        public async Task<IActionResult> GetAllAccessoriesTypeDetails()
        {
            try
            {
                var rAM = await _accessoriesTypeService.GetAllAccessoriesTypeDetails();
                return Json(new { success = true, message = "Successfully retrieved Accessories Type", data = rAM });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }


        [HttpGet("GetAccessoriesTypeDetailById")]
        public async Task<IActionResult> GetAccessoriesTypeDetailById(int id)
        {
            try
            {
                var ram = await _accessoriesTypeService.GetAccessoriesTypeDetailById(id);
                if (ram == null)
                    return NotFound(new { success = false, message = "RAM not found" });

                return Ok(new { success = true, message = "Successfully retrieved Accessories Type", data = ram });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }


        [HttpPost("CreateAccessoriesType")]
        public async Task<IActionResult> CreateAccessoriesType(AccessoriesTypeDto accessoriesTypeDto)
        {
            try
            {
                var createRAM = await _accessoriesTypeService.CreateAccessoriesType(accessoriesTypeDto);
                return CreatedAtAction(nameof(GetAccessoriesTypeDetailById), new { id = createRAM.Id }, createRAM);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }


        [HttpPost("UpdateAccessoriesType")]
        public async Task<IActionResult> UpdateAccessoriesType(int accessoriesId, AccessoriesTypeDto accessoriesTypeDto)
        {
            try
            {
                await _accessoriesTypeService.UpdateAccessoriesType(accessoriesId,accessoriesTypeDto);
                return Ok(new { success = true, message = "Accessories Type updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }


        [HttpPost("RemoveAccessoriesType")]
        public async Task<IActionResult> RemoveAccessoriesType(int id)
        {
            try
            {
                await _accessoriesTypeService.RemoveAccessoriesType(id);
                return Ok(new { success = true, message = "Accessories Type deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

    }
}
