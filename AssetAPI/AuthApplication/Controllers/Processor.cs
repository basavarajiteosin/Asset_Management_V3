using AssetManagementAPI.Services;
using AuthApplication.Models;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagementAPI.Controllers
{
    [ApiController]
    [Route("api/AssetManagement")]
    public class ProcessorController : Controller
    {
        private readonly IProcessorService _processorService;
        public ProcessorController(IProcessorService processorService)
        {
            _processorService = processorService;
        }
        [HttpGet("GetAllProcessorDetails")]
        public async Task<IActionResult> GetAllProcessorDetails()
        {
            try
            {
                var processors = await _processorService.GetAllProcessorDetails();
                return Json(new { success = true, message = "Successfully retrieved processor", data = processors });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetProcessorDetailById")]
        public async Task<IActionResult> GetProcessorDetailById(int id)
        {
            try
            {
                var processor = await _processorService.GetProcessorDetailById(id);
                if (processor == null)
                    return NotFound(new { success = false, message = "Processor not found" });

                return Ok(new { success = true, message = "Successfully retrieved Processor", data = processor });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateProcessor")]
        public async Task<IActionResult> CreateProcessor(ProcessorDto processorDto)
        {
            try
            {
                var createProcessor = await _processorService.CreateProcessor(processorDto);
                return CreatedAtAction(nameof(GetProcessorDetailById), new { id = createProcessor.Id }, createProcessor);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateProcessor")]
        public async Task<IActionResult> UpdateProcessor(int processorId, ProcessorDto processorDto)
        {
            try
            {
                await _processorService.UpdateProcessor(processorId, processorDto);
                return Ok(new { success = true, message = "Processor updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("RemoveProcessor")]
        public async Task<IActionResult> RemoveProcessor(int id)
        {
            try
            {
                await _processorService.RemoveProcessor(id);
                return Ok(new { success = true, message = "Processor deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

    }
}
