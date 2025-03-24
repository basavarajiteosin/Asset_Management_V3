using AssetManagementAPI.Services;
using AuthApplication.Models;
using Microsoft.AspNetCore.Mvc;
using PMOAPIV2.Services;

namespace AssetManagementAPI.Controllers
{
    [ApiController]
    [Route("api/AssetManagement")]
    public class AssetTypeController : Controller
    {
        private readonly IAssetTypeService  _assetTypeService;
        public AssetTypeController(IAssetTypeService assetTypeService)
        {
            _assetTypeService = assetTypeService;
        }
        [HttpGet("GetAllAssetTypeDetails")]
        public async Task<IActionResult> GetAllAssetTypeDetails()
        {
            try
            {
                var assetType = await _assetTypeService.GetAllAssetTypeDetails();
                return Json(new { success = true, message = "Successfully retrieved asset types", data = assetType });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetAssetTypeDetailById")]
        public async Task<IActionResult> GetAssetTypeDetailById(int id)
        {
            try
            {
                var assetType = await _assetTypeService.GetAssetTypeDetailById(id);
                if (assetType == null)
                    return NotFound(new { success = false, message = "AssetType not found" });

                return Ok(new { success = true, message = "Successfully retrieved DeviceAsset", data = assetType });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateAssetType")]
        public async Task<IActionResult> CreateAssetType(AssetTypeDto assetTpe)
        {
            try
            {
                var createdassetType = await _assetTypeService.CreateAssetType(assetTpe);
                return CreatedAtAction(nameof(GetAssetTypeDetailById), new { id = createdassetType.Id }, createdassetType);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateAssetType")]
        public async Task<IActionResult> UpdateAssetType(int assetTypeId, AssetTypeDto assetType)
        {
            try
            {
                await _assetTypeService.UpdateAssetType(assetTypeId, assetType);
                return Ok(new { success = true, message = "Asset type updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("RemoveAssetType")]
        public async Task<IActionResult> RemoveAssetType(int id)
        {
            try
            {
                await _assetTypeService.RemoveAssetType(id);
                return Ok(new { success = true, message = "Asset Type deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }


    }
}
