using AssetManagementAPI.Services;
using AuthApplication.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PMOAPIV2.Services;
namespace PMOAPIV2.Controllers
{
    [ApiController]
    [Route("api/AssetAssignment")]
    public class AssetAssignemntController : Controller
    {
        private readonly IAssetService _assetService;
        public AssetAssignemntController(IAssetService assetService)
        {
            _assetService = assetService;
        }
        [HttpGet("GetDetailsOfAllAssets")]
        public async Task<IActionResult> GetAllAssets()
        {
            try
            {
                var assets = await _assetService.GetAllAssets();
                return Json(new { success = true, message = "Successfully retrieved assets", data = assets });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }




        [HttpGet("GetAssetDetailById")]
        public async Task<IActionResult> GetAssetById(int id)
        {
            try
            {
                var asset = await _assetService.GetAssetById(id);
                if (asset == null)
                    return NotFound(new { success = false, message = "Asset not found" });

                return Ok(new { success = true, message = "Successfully retrieved asset", data = asset });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }


        [HttpGet("GetAssetsDetailsByUser")]
        public async Task<IActionResult> GetAssetsDetailsByUser(Guid userId)
        {
            try
            {
                var asset = await _assetService.GetUserAssetDetailes(userId);
                if (asset == null)
                    return NotFound(new { success = false, message = "Asset not found" });

                return Ok(new { success = true, message = "Successfully retrieved asset", data = asset });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        } 

        [HttpGet("GetAssetHistoryById")]
        public async Task<IActionResult> GetAssetHistoryById(int assetId)
        {
            try
            {
                var asset = await _assetService.GetAssetHistoryById(assetId);
                if (asset == null)
                    return NotFound(new { success = false, message = "Asset not found" });

                return Ok(new { success = true, message = "Successfully retrieved asset", data = asset });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteMndDocAttachment([FromBody] DeleteMandateDocRequest request)
        {
            if (request.MandateDocId <= 0)
            {
                return BadRequest(new { message = "Invalid MandateDocId" });
            }

            var isDeleted = await _assetService.DeleteMandateDocAttachmentAsync(request.MandateDocId);
            if (!isDeleted)
            {
                return NotFound(new { message = "Mandate document not found." });
            }

            return Ok(new { message = "Mandate document deleted successfully." });
        }


        [HttpPost("AssignAssetDetail")]
        public async Task<IActionResult> CreateAsset([FromForm] AssetWithAttachmentDto asset)
        {
            try
            {
                var createdAsset = await _assetService.CreateAsset(asset);
                return Ok(new { success = true, data=createdAsset});
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateAssetDetail")]
        public async Task<IActionResult> UpdateAsset(int assetId, [FromForm] AssetWithAttachmentDto asset)
        {
            try
            {
                await _assetService.UpdateAsset(assetId, asset);
                return Ok(new { success = true, message = "Asset updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("RemoveAssetDetail")]
        public async Task<IActionResult> DeleteAsset(int id)
        {
            try
            {
                await _assetService.DeleteAsset(id);
                return Ok(new { success = true, message = "Asset deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        [HttpGet("GetTotalCountsOfAsset")]
        public async Task<IActionResult> GetTotalAssetCounts()
        {
            try
            {
                var assets = await _assetService.GetTotalAssetCounts();
                if (assets == null || assets.Length == 0)
                    return NotFound(new { success = false, message = "Asset count not found" });

                // Construct key-value pairs from tuple array
                var data = assets.ToDictionary(tuple => tuple.Key, tuple => tuple.Value);

                return Ok(new { success = true, message = "Successfully retrieved Assets", data });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        //[HttpGet("GetAssetDetailById")]
        //public async Task<IActionResult> GetAssignedAssets(string status)
        //{
        //    try
        //    {
        //        var asset = await _assetService.GetAssignedAssets(status);
        //        if (asset == null)
        //            return NotFound(new { success = false, message = "Asset not found" });

        //        return Ok(new { success = true, message = "Successfully retrieved asset", data = asset });
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { success = false, message = ex.Message });
        //    }
        //}

        [HttpGet("assigned-assets")]
        public async Task<ActionResult<List<AssetMasterForData>>> GetAssignedAssets(string status)
        {
            try
            {
                var assets = await _assetService.GetAssignedAssets(status);
                return Ok(assets);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
