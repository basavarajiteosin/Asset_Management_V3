using AssetManagementAPI.Services;
using AuthApplication.Models;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagementAPI.Controllers
{
    [ApiController]
    [Route("api/AssetManagement")]
    public class ModelsController : Controller
    {
        private readonly IModelService _modelService;
        public ModelsController(IModelService modelService)
        {
            _modelService = modelService;
        }
        [HttpGet("GetAllModelsDetails")]
        public async Task<IActionResult> GetAllModelsDetails()
        {
            try
            {
                var assetType = await _modelService.GetAllModelsDetails();
                return Json(new { success = true, message = "Successfully retrieved models", data = assetType });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetModelDetailById")]
        public async Task<IActionResult> GetModelDetailById(int id)
        {
            try
            {
                var assetType = await _modelService.GetModelDetailById(id);
                if (assetType == null)
                    return NotFound(new { success = false, message = "Models not found" });

                return Ok(new { success = true, message = "Successfully retrieved Models", data = assetType });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateModel")]
        public async Task<IActionResult> CreateModel(ModelsDto assetTpe)
        {
            try
            {
                var createdassetType = await _modelService.CreateModel(assetTpe);
                return CreatedAtAction(nameof(GetModelDetailById), new { id = createdassetType.Id }, createdassetType);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateModel")]
        public async Task<IActionResult> UpdateModel(int assetTypeId, ModelsDto assetType)
        {
            try
            {
                await _modelService.UpdateModel(assetTypeId, assetType);
                return Ok(new { success = true, message = "Model updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("RemoveModel")]
        public async Task<IActionResult> RemoveModel(int id)
        {
            try
            {
                await _modelService.RemoveModel(id);
                return Ok(new { success = true, message = "Model deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
