using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PMOAPIV2.Services;
using AuthApplication.Models;
namespace PMOAPIV2.Controllers
{
    [ApiController]
    [Route("api/AssetManagement")]
    public class AssetMasterController : Controller
    {
        private readonly IDeviceAssetService _deviceAssetService;
        public AssetMasterController(IDeviceAssetService deviceAssetService)
        {
            _deviceAssetService = deviceAssetService;
        }

        [HttpGet("GetAllAssetDetails")]
        public async Task<IActionResult> GetAllDevices()
        {
            try
            {
                var devices = await _deviceAssetService.GetAllDevices();
                return Json(new { success = true, message = "Successfully retrieved devices", data = devices });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetAssetDetailById")]
        public async Task<IActionResult> GetDeviceById(int id)
        {
            try
            {
                var deviceAsset = await _deviceAssetService.GetDeviceById(id);
                if (deviceAsset == null)
                    return NotFound(new { success = false, message = "DeviceAsset not found" });

                return Ok(new { success = true, message = "Successfully retrieved DeviceAsset", data = deviceAsset });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateAsset")]
        public async Task<IActionResult> CreateDevice([FromForm]DeviceMasterWithIssuesDto device)
        {
            try
            {
                var createdDevice = await _deviceAssetService.CreateDevice(device);
                return CreatedAtAction(nameof(GetDeviceById), new { id = createdDevice.Id }, createdDevice);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateAsset")]
        public async Task<IActionResult> UpdateDevice([FromForm] DeviceMasterWithIssuesDto device)
        {
            try
            {
                await _deviceAssetService.UpdateDevice(device.deviceId, device);
                return Ok(new { success = true, message = "DeviceAsset updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("RemoveAsset")]
        public async Task<IActionResult> DeleteDevice(int id)
        {
            try
            {
                await _deviceAssetService.DeleteDevice(id);
                return Ok(new { success = true, message = "DeviceAsset deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteAttachment([FromBody] DeleteAttachmentRequest request)
        {
            if (request.AttachId <= 0)
            {
                return BadRequest(new { message = "Invalid AttachId" });
            }

            var isDeleted = await _deviceAssetService.DeleteAttachmentAsync(request.AttachId);
            if (!isDeleted)
            {
                return NotFound(new { message = "Attachment not found." });
            }

            return Ok(new { message = "Attachment deleted successfully." });
        }


        [HttpGet("GetAssetDetailByAssetType")]
        public async Task<IActionResult> GetAssetDetailByAssetType(string inputAssetType)
        {
            try
            {
                var assetDetail = await _deviceAssetService.GetAssetDetailByAssetType(inputAssetType);
                if (assetDetail == null)
                    return NotFound(new { success = false, message = "AssetType not found" });

                return Ok(new { success = true, message = "Successfully retrieved Asset Detail", data = assetDetail });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetAssetAssignmentDetailByAssetType")]
        public async Task<IActionResult> GetAssetAssignmentDetailByAssetType(string inputAssetType)
        {
            try
            {
                var assetDetail = await _deviceAssetService.GetAssetAssignmentDetailByAssetType(inputAssetType);
                if (assetDetail == null)
                    return NotFound(new { success = false, message = "AssetType not found" });

                return Ok(new { success = true, message = "Successfully retrieved Asset Detail", data = assetDetail });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetAssetAssignmentDetailByModelAndSNo")]
        public async Task<IActionResult> GetAssetAssignmentDetailByModelAndSNo(string inputModel, string inputSno)
        {
            try
            {
                var assetDetail = await _deviceAssetService.GetAssetAssignmentDetailByModelAndSNo(inputModel,inputSno);
                if (assetDetail == null)
                    return NotFound(new { success = false, message = "Assignment of Asset not found" });

                return Ok(new { success = true, message = "Successfully retrieved Asset Detail", data = assetDetail });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
