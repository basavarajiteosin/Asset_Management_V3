using AuthApplication.DbContexts;
using AuthApplication.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Threading.Tasks;

namespace PMOAPIV2.Services
{
    public interface IDeviceAssetService
    {
        Task<List<AssetMasterModel>> GetAllDevices();
        Task<AssetMaster> GetDeviceById(int id);
        Task<AssetMaster> CreateDevice(DeviceMasterWithIssuesDto device);
        Task<AssetMaster> UpdateDevice(int deviceId, DeviceMasterWithIssuesDto device);
        Task<AssetMaster> DeleteDevice(int deviceId);
        Task<List<AssetMaster>> GetAssetDetailByAssetType(string inputAsset);
        Task<List<AssetsAssignment>> GetAssetAssignmentDetailByAssetType(string inputAsset);
        Task<List<AssetDetailsFrom2TablesDto>> GetAssetAssignmentDetailByModelAndSNo(string inputModel, string inputSno);
        Task<bool> DeleteAttachmentAsync(int attachId);

    }

    public class DeviceAssetService : IDeviceAssetService
    {
        private readonly AuthAppContext _dbContext;
        private readonly IConfiguration _configuration;
        public DeviceAssetService(AuthAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }
        public async Task<List<AssetMasterModel>> GetAllDevices()
        {
            try
            {
                var assetData = await _dbContext.AssetMaster
                                                .Where(a => a.IsActive == true)
                                                .ToListAsync();
                var assetMasterModels = new List<AssetMasterModel>();

                foreach (var item in assetData)
                {
                    var attachments = await _dbContext.AttachmentMaster
                        .Where(x => x.AssetId == item.Id)
                        .ToListAsync();
                    var doumentdata = await _dbContext.MandateDocAsset
                       .Where(x => x.AssetId == item.Id)
                       .ToListAsync();
                    var assetMasterData = new AssetMasterModel
                    {
                        Id = item.Id,
                        AssetType = item.AssetType,
                        Model = item.Model,
                        SerialNumber = item.SerialNumber,
                        Processor = item.Processor,
                        Genration = item.Genration,
                        RAM = item.RAM,
                        HDD = item.HDD,
                        PurchaseDate = item.PurchaseDate,
                        VendorName = item.VendorName,
                        WarrantyStatus = item.WarrantyStatus,
                        OS = item.OS,
                        PreviousUser = item.PreviousUser,
                        Remarks = item.Remarks,
                        ChargerAllocation = item.ChargerAllocation,
                        ChargerType = item.ChargerType,
                        Location = item.Location,
                        SpecificationIfAny = item.SpecificationIfAny,
                        attachmentMasters = attachments,
                        mandateDocAsset = doumentdata,
                        accessoriesType = item.accessoriesType,
                        Brand = item.Brand
                    };

                    assetMasterModels.Add(assetMasterData);
                }

                return assetMasterModels;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve DeviceAsset: " + ex.Message);
            }
        }

        public async Task<AssetMaster> GetDeviceById(int id)
        {
            try
            {
                var device = await _dbContext.AssetMaster.FindAsync(id);
                if (device == null)
                {
                    throw new Exception("Device not found!");
                }

                return device;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<AssetMaster> CreateDevice(DeviceMasterWithIssuesDto device)
        {
            try
            {
                if (device.AssetType.Contains("Laptop"))
                {
                    var existingDevice = await _dbContext.AssetMaster
                                                         .FirstOrDefaultAsync(t => t.SerialNumber == device.SerialNumber && t.IsActive == true);
                    if (existingDevice != null)
                    {
                        throw new Exception("Device Already Exists!");
                    }
                }

                var newDevice = new AssetMaster
                {
                    AssetType = device.AssetType,
                    Model = device.Model ?? "",
                    SerialNumber = device.SerialNumber ?? "",
                    Processor = device.Processor ?? "",
                    Genration = device.Genration ?? "",
                    RAM = device.RAM ?? "",
                    HDD = device.HDD ?? "",
                    PurchaseDate = DateTime.Now,
                    VendorName = device.VendorName,
                    WarrantyStatus = device.WarrantyStatus,
                    OS = device.OS,
                    PreviousUser = device.PreviousUser,
                    Remarks = device.Remarks,
                    ChargerAllocation = device.ChargerAllocation,
                    ChargerType = device.ChargerType,
                    Location = device.Location,
                    SpecificationIfAny = device.SpecificationIfAny,
                    IsActive = true,
                    CreatedBy = device.CreatedBy,
                    CreatedOn = DateTime.Now,
                    accessoriesType = device.accessoriesType,
                    Brand = device.Brand
                };

                _dbContext.AssetMaster.Add(newDevice);
                await _dbContext.SaveChangesAsync();

                var deviceId = newDevice.Id;

                string folderPath = _configuration["FolderPath1"];
                string portalAddress = _configuration["ApiURL"];
                string foldername = "/ProfileAttachemants/AssetAttachments/";

                // Save Attachments
                if (device.Attachments != null)
                {
                    var tempIndex = 0;
                    for (int i = 0; i < device.Attachments.Count; i++)
                    {
                        var file = device.Attachments[i];
                        var fileName = $"{Guid.NewGuid()}_{file.FileName.Replace(" ", "_")}";
                        var filePath = Path.Combine(folderPath, fileName);
                        string dbfilePath = portalAddress + Path.Combine(foldername, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        var attachment = new AttachmentMaster
                        {
                            AssetId = deviceId,
                            DocumentName = device.DocumentName[i],
                            CreatedBy = device.CreatedBy,
                            CreatedOn = DateTime.Now,
                            AttachmentFilePath = filePath,
                            AttachmentServerPath = dbfilePath,
                            FileName = file.FileName
                        };
                        _dbContext.AttachmentMaster.Add(attachment);
                        tempIndex++;
                    }
                    await _dbContext.SaveChangesAsync();
                }

                // Save Mandate Documents
                if (device.MandateDocuments != null)
                {
                    for (int i = 0; i < device.MandateDocuments.Count; i++)
                    {
                        var file = device.MandateDocuments[i];
                        var fileName = $"{Guid.NewGuid()}_{file.FileName.Replace(" ", "_")}";
                        var filePath = Path.Combine(folderPath, fileName);
                        string dbfilePath = portalAddress + Path.Combine(foldername, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        var mandateAttachment = new MandateDocAsset
                        {
                            AttachmentFilePath = filePath,
                            DocumentName = device.DocumentName != null && device.DocumentName.Count > i ? device.DocumentName[i] : "",
                            AttachmentServerPath = dbfilePath
                        };

                        _dbContext.MandateDocAsset.Add(mandateAttachment);
                        await _dbContext.SaveChangesAsync();

                        // After saving mandate attachment, associate it with the Asset (deviceId)
                        mandateAttachment.AttachId = mandateAttachment.AttachId; // ensure AttachId is set after insertion
                        mandateAttachment.AssetId = deviceId; // Link the Mandate document to the deviceId (AssetId)
                        _dbContext.MandateDocAsset.Update(mandateAttachment);
                        await _dbContext.SaveChangesAsync();
                    }
                }

                return newDevice;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }


        public async Task<AssetMaster> UpdateDevice(int deviceId, DeviceMasterWithIssuesDto deviceDto)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingDevice = await _dbContext.AssetMaster.FindAsync(deviceId);
                    if (existingDevice == null)
                    {
                        throw new Exception("Device not found!");
                    }

                    // Update the device information
                    existingDevice.AssetType = deviceDto.AssetType;
                    existingDevice.Model = deviceDto.Model;
                    existingDevice.SerialNumber = deviceDto.SerialNumber;
                    existingDevice.Processor = deviceDto.Processor;
                    existingDevice.Genration = deviceDto.Genration;
                    existingDevice.RAM = deviceDto.RAM;
                    existingDevice.HDD = deviceDto.HDD;
                    existingDevice.PurchaseDate = deviceDto.PurchaseDate;
                    existingDevice.VendorName = deviceDto.VendorName;
                    existingDevice.WarrantyStatus = deviceDto.WarrantyStatus;
                    existingDevice.OS = deviceDto.OS;
                    existingDevice.PreviousUser = deviceDto.PreviousUser;
                    existingDevice.Remarks = deviceDto.Remarks;
                    existingDevice.ChargerAllocation = deviceDto.ChargerAllocation;
                    existingDevice.ChargerType = deviceDto.ChargerType;
                    existingDevice.Location = deviceDto.Location;
                    existingDevice.SpecificationIfAny = deviceDto.SpecificationIfAny;
                    existingDevice.IsActive = deviceDto.IsActive;
                    existingDevice.ModifiedBy = deviceDto.ModifiedBy;
                    existingDevice.ModifiedOn = DateTime.Now;
                    existingDevice.accessoriesType = deviceDto.accessoriesType;
                    existingDevice.Brand = deviceDto.Brand;
                    _dbContext.Entry(existingDevice).State = EntityState.Modified;

                    // Delete specified attachments
                    if (deviceDto.DeleteDocIds != null)
                    {
                        var deleteListArray = deviceDto.DeleteDocIds.Split(',');
                        foreach (var item in deleteListArray)
                        {
                            var existingAttachment = _dbContext.AttachmentMaster.FirstOrDefault(x => x.Id == Int32.Parse(item));
                            if (existingAttachment != null)
                            {
                                _dbContext.AttachmentMaster.Remove(existingAttachment);
                                await _dbContext.SaveChangesAsync();
                            }
                        }
                    }

                    var newDeviceId = existingDevice.Id;
                    string folderPath = _configuration["FolderPath1"];
                    string portalAddress = _configuration["ApiURL"];
                    string folderName = "/ProfileAttachemants/AssetAttachments/";

                    // Save new Attachments
                    if (deviceDto.Attachments != null)
                    {
                        for (int i = 0; i < deviceDto.Attachments.Count; i++)
                        {
                            var file = deviceDto.Attachments[i];
                            var fileName = $"{Guid.NewGuid()}_{file.FileName.Replace(" ", "_")}";
                            var filePath = Path.Combine(folderPath, fileName);
                            string dbFilePath = portalAddress + Path.Combine(folderName, fileName);

                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {
                                await file.CopyToAsync(stream);
                            }

                            var attachment = new AttachmentMaster
                            {
                                AssetId = deviceId,
                                DocumentName = deviceDto.DocumentName[i],
                                CreatedBy = deviceDto.CreatedBy,
                                CreatedOn = DateTime.Now,
                                AttachmentFilePath = filePath,
                                AttachmentServerPath = dbFilePath,
                                FileName = file.FileName
                            };
                            _dbContext.AttachmentMaster.Add(attachment);
                        }
                    }

                    // Save new Mandate Documents (if provided)
                    if (deviceDto.MandateDocuments != null)
                    {
                        for (int i = 0; i < deviceDto.MandateDocuments.Count; i++)
                        {
                            var file = deviceDto.MandateDocuments[i];
                            var fileName = $"{Guid.NewGuid()}_{file.FileName.Replace(" ", "_")}";
                            var filePath = Path.Combine(folderPath, fileName);
                            string dbFilePath = portalAddress + Path.Combine(folderName, fileName);

                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {
                                await file.CopyToAsync(stream);
                            }

                            var mandateAttachment = new MandateDocAsset
                            {
                                AttachmentFilePath = filePath,
                                DocumentName = deviceDto.DocumentName != null && deviceDto.DocumentName.Count > i ? deviceDto.DocumentName[i] : "",
                                AttachmentServerPath = dbFilePath
                            };

                            _dbContext.MandateDocAsset.Add(mandateAttachment);
                            await _dbContext.SaveChangesAsync();

                            mandateAttachment.AttachId = mandateAttachment.AttachId; // Ensure AttachId is set after insertion
                            mandateAttachment.AssetId = newDeviceId; // Link the Mandate document to the deviceId (AssetId)
                            _dbContext.MandateDocAsset.Update(mandateAttachment);
                            await _dbContext.SaveChangesAsync();
                        }
                    }

                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                    return existingDevice;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
        }


        public async Task<bool> DeleteAttachmentAsync(int attachId)
        {
            var attachment = await _dbContext.MandateDocAsset.FindAsync(attachId);
            if (attachment == null)
            {
                return false; // Not found
            }

            _dbContext.MandateDocAsset.Remove(attachment);
            await _dbContext.SaveChangesAsync();

            // Optional: Delete the file from the server if needed
            if (!string.IsNullOrEmpty(attachment.AttachmentServerPath))
            {
                try
                {
                    if (File.Exists(attachment.AttachmentServerPath))
                    {
                        File.Delete(attachment.AttachmentServerPath);
                    }
                }
                catch (Exception ex)
                {
                    // Log the error
                    Console.WriteLine($"Error deleting file: {ex.Message}");
                }
            }

            return true;
        }

        public async Task<AssetMaster> DeleteDevice(int id)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var device = await _dbContext.AssetMaster.FindAsync(id);
                    if (device == null)
                    {
                        throw new Exception("Device not found!");
                    }

                    // Delete all Attachments associated with the device
                    //var deviceAttachments = _dbContext.AttachmentMaster.Where(t => t.AssetId == id).ToList();
                    //if (deviceAttachments.Any())
                    //{
                    //    _dbContext.AttachmentMaster.RemoveRange(deviceAttachments);
                    //    await _dbContext.SaveChangesAsync();
                    //}

                    // Delete all Mandate Documents associated with the device
                    //var deviceMandateDocs = _dbContext.MandateDocAsset.Where(t => t.AssetId == id).ToList();
                    //if (deviceMandateDocs.Any())
                    //{
                    //    _dbContext.MandateDocAsset.RemoveRange(deviceMandateDocs);
                    //    await _dbContext.SaveChangesAsync();
                    //}

                    // Finally, delete the device itself
                    //_dbContext.AssetMaster.Remove(device);

                    // Instead of deleting, mark the device as inactive
                    device.IsActive = false;
                    device.ModifiedOn = DateTime.Now;
                    await _dbContext.SaveChangesAsync();

                    // Commit transaction
                    transaction.Commit();

                    return device;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
        }


        public async Task<List<AssetMaster>> GetAssetDetailByAssetType(string inputAsset)
        {
            if (!string.IsNullOrEmpty(inputAsset))
            {
                var assetDetail = await _dbContext.AssetMaster
                                  .Where(t => t.AssetType == inputAsset && t.IsActive == true)
                                  .ToListAsync();

                return assetDetail;
            }
            return new List<AssetMaster>();
        }

        public async Task<List<AssetsAssignment>> GetAssetAssignmentDetailByAssetType(string inputAsset)
        {
            if (!string.IsNullOrEmpty(inputAsset))
            {
                var assetDetailInAssetMaster = await _dbContext.AssetMaster
                                               .Where(t => t.AssetType == inputAsset && t.IsActive == true)
                                               .ToListAsync();

                if (assetDetailInAssetMaster.Count <= 0)
                {
                    throw new Exception("Asset Type is not available in Asset Master..!");
                }
                else
                {
                    var assetDetail = await _dbContext.AssetsAssignment
                                                  .Where(t => t.AssetName == inputAsset)
                                                  .ToListAsync();
                    return assetDetail;
                }
            }
            return new List<AssetsAssignment>();
        }

        public async Task<List<AssetDetailsFrom2TablesDto>> GetAssetAssignmentDetailByModelAndSNo(string inputModel, string inputSno)
        {
            if (!string.IsNullOrEmpty(inputModel) && !string.IsNullOrEmpty(inputSno))
            {
                // Perform a join between AssetMaster and AssetsAssignment using LINQ
                var assetDetails = await (from aa in _dbContext.AssetsAssignment
                                          join am in _dbContext.AssetMaster
                                          on new { aa.Model, aa.SerialNumber } equals new { am.Model, am.SerialNumber }
                                          where am.Model == inputModel
                                        && am.SerialNumber == inputSno
                                        && am.IsActive == true // Ensure only active assets are retrieved
                                          select new AssetDetailsFrom2TablesDto
                                          {
                                              AssignedUser = aa.AssignedUser,
                                              AssignedBy = aa.AssignedBy,
                                              AssignedDate = aa.AssignedDate,
                                              AssignedTillDate = aa.AssignedTillDate,
                                              Model = am.Model,
                                              SerialNumber = am.SerialNumber,
                                              Processor = am.Processor,
                                              Generation = am.Genration,
                                              RAM = am.RAM,
                                              HDD = am.HDD,
                                              PurchaseDate = am.PurchaseDate,
                                              VendorName = am.VendorName,
                                              WarrantyStatus = am.WarrantyStatus
                                          }).ToListAsync();

                if (assetDetails.Count == 0)
                {
                    throw new Exception("Asset with the given Model and Serial Number is not available in Asset Master..!");
                }

                return assetDetails;
            }
            return new List<AssetDetailsFrom2TablesDto>();
        }

    }
}
