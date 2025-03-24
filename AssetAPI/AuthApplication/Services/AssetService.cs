using AuthApplication.DbContexts;
using AuthApplication.Models;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Eventing.Reader;
using System.Diagnostics.Metrics;
using System.Threading.Tasks;

namespace PMOAPIV2.Services
{
    public interface IAssetService
    {
        Task<List<AssetsAssignmentWithAttachment>> GetAllAssets();
        Task<AssetsAssignmentWithAttachment> GetAssetById(int id);
        Task<List<AssetsHistoryDataattach>> GetAssetHistoryById(int assetId);
        Task<List<AssetsAssignmentWithAttachment>> GetUserAssetDetailes(Guid userId);
        Task<AssetsAssignment> CreateAsset(AssetWithAttachmentDto assets);
        Task<AssetsAssignment> UpdateAsset(int assetId, AssetWithAttachmentDto asset);
        Task<AssetsAssignment> DeleteAsset(int id);
        Task<(string Key, int Value)[]> GetTotalAssetCounts();
        Task<List<AssetMasterForData>> GetAssignedAssets(string status);
        Task<bool> DeleteMandateDocAttachmentAsync(int mandateDocId);

    }
    public class AssetService : IAssetService
    {
        private readonly AuthAppContext _dbContext;
        private readonly IConfiguration _configuration;
        public AssetService(AuthAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }
        public async Task<List<AssetsAssignmentWithAttachment>> GetAllAssets()
        {
            try
            {
                var assetsList = await _dbContext.AssetsAssignment
                    .Where(a => a.IsActive) // Fetch only active assets
                    .ToListAsync();

                var assetIds = assetsList.Select(a => a.Id).ToList(); // Get asset IDs

                var attachments = await _dbContext.MandateDocByAssetsAssignment
                    .Where(doc => assetIds.Contains(doc.AssetAssignmentId))
                    .ToListAsync(); // Fetch related attachments

                // Merge assets with their corresponding attachments
                var result = assetsList.Select(asset => new AssetsAssignmentWithAttachment
                {
                    Id = asset.Id,
                    AssetName = asset.AssetName,
                    AssignedUser = asset.AssignedUser,
                    AssignedBy = asset.AssignedBy,
                    AssignedDate = asset.AssignedDate,
                    Specifications = asset.Specifications,
                    ApprovedBy = asset.ApprovedBy,
                    ReviewedBy = asset.ReviewedBy,
                    Remarks = asset.Remarks,
                    AssignedTillDate = asset.AssignedTillDate,
                    IsActive = asset.IsActive,
                    CreatedOn = asset.CreatedOn,
                    CreatedBy = asset.CreatedBy,
                    ModifiedOn = asset.ModifiedOn,
                    ModifiedBy = asset.ModifiedBy,
                    SerialNumber = asset.SerialNumber,
                    productId = asset.productId,
                    Model = asset.Model,
                    MandateDocByAssetsAssignment = attachments
                        .Where(doc => doc.AssetAssignmentId == asset.Id)
                        .ToList()
                }).ToList();

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve Assets: " + ex.Message);
            }
        }

        public async Task<AssetsAssignmentWithAttachment> GetAssetById(int id)
        {
            try
            {
                var asset = await _dbContext.AssetsAssignment.FindAsync(id);
                if (asset == null)
                {
                    throw new Exception("Asset not found!");
                }

                var attachments = await _dbContext.MandateDocByAssetsAssignment
                    .Where(doc => doc.AssetAssignmentId == id)
                    .ToListAsync(); // Fetch related attachments

                return new AssetsAssignmentWithAttachment
                {
                    Id = asset.Id,
                    AssetName = asset.AssetName,
                    AssignedUser = asset.AssignedUser,
                    AssignedBy = asset.AssignedBy,
                    AssignedDate = asset.AssignedDate,
                    Specifications = asset.Specifications,
                    ApprovedBy = asset.ApprovedBy,
                    ReviewedBy = asset.ReviewedBy,
                    Remarks = asset.Remarks,
                    AssignedTillDate = asset.AssignedTillDate,
                    IsActive = asset.IsActive,
                    CreatedOn = asset.CreatedOn,
                    CreatedBy = asset.CreatedBy,
                    ModifiedOn = asset.ModifiedOn,
                    ModifiedBy = asset.ModifiedBy,
                    SerialNumber = asset.SerialNumber,
                    productId = asset.productId,
                    Model = asset.Model,
                    MandateDocByAssetsAssignment = attachments // Assign attachments
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<List<AssetsAssignmentWithAttachment>> GetUserAssetDetailes(Guid userId)
        {
            try
            {
                var userAssetData = await _dbContext.AssetsAssignment
                    .Where(x => x.AssignedUser == userId.ToString() && x.IsActive) // Fetch only active assets
                    .OrderByDescending(x => x.CreatedOn) // Sort by CreatedOn (Latest First)
                    .Select(asset => new AssetsAssignmentWithAttachment
                    {
                        Id = asset.Id,
                        AssetName = asset.AssetName,
                        AssignedUser = asset.AssignedUser,
                        AssignedBy = asset.AssignedBy,
                        AssignedDate = asset.AssignedDate,
                        Specifications = asset.Specifications,
                        ApprovedBy = asset.ApprovedBy,
                        ReviewedBy = asset.ReviewedBy,
                        Remarks = asset.Remarks,
                        AssignedTillDate = asset.AssignedTillDate,
                        IsActive = asset.IsActive,
                        CreatedOn = asset.CreatedOn,
                        CreatedBy = asset.CreatedBy,
                        ModifiedOn = asset.ModifiedOn,
                        ModifiedBy = asset.ModifiedBy,
                        SerialNumber = asset.SerialNumber,
                        Model = asset.Model,
                        productId = asset.productId,
                        MandateDocByAssetsAssignment = _dbContext.MandateDocByAssetsAssignment
                            .Where(doc => doc.AssetAssignmentId == asset.Id)
                            .ToList() // Fetch related documents
                    })
                    .ToListAsync();

                return userAssetData ?? new List<AssetsAssignmentWithAttachment>();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }


        public async Task<List<AssetsHistoryDataattach>> GetAssetHistoryById(int assetId)
        {
            try
            {
                var assetHistoryList = await _dbContext.assetsHistory
                    .Where(x => x.assetId == assetId)
                    .OrderByDescending(x => x.CreatedOn) // Sort by CreatedOn (Latest First)
                    .Select(asset => new AssetsHistoryDataattach
                    {
                        Id = asset.Id,
                        assetId = asset.assetId,
                        AssignedUser = asset.AssignedUser,
                        AssignedBy = asset.AssignedBy,
                        AssignedDate = asset.AssignedDate,
                        Specifications = asset.Specifications,
                        ApprovedBy = asset.ApprovedBy,
                        ReviewedBy = asset.ReviewedBy,
                        Remarks = asset.Remarks,
                        AssignedTillDate = asset.AssignedTillDate,
                        IsActive = asset.IsActive,
                        CreatedOn = asset.CreatedOn,
                        CreatedBy = asset.CreatedBy,
                        ModifiedOn = asset.ModifiedOn,
                        ModifiedBy = asset.ModifiedBy,
                        SerialNumber = asset.SerialNumber,
                        Model = asset.Model,
                        productId = asset.productId,
                        DocForAssetsHistoryAssignment = _dbContext.DocForAssetsHistoryAssignment
                            .Where(doc => doc.AssetHistoryId == asset.Id)
                            .ToList() // Fetch related documents
                    })
                    .ToListAsync();

                return assetHistoryList ?? new List<AssetsHistoryDataattach>();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }



        //public async Task<AssetsAssignment> CreateAsset(AssetWithAttachmentDto assets)
        //{
        //    try
        //    {
        //        var existingAsset = await _dbContext.AssetsAssignment.FirstOrDefaultAsync(t => t.AssetName == assets.AssetName && t.AssignedUser == assets.AssignedUser && t.SerialNumber == assets.SerialNumber);
        //        if (existingAsset != null)
        //        {
        //            if(existingAsset.IsActive == false)
        //            {
        //                existingAsset.AssetName = assets.AssetName;
        //                existingAsset.AssignedUser = assets.AssignedUser;
        //                existingAsset.AssignedBy = assets.AssignedBy;
        //                existingAsset.AssignedDate = assets.AssignedDate;
        //                existingAsset.Specifications = assets.Specifications;
        //                existingAsset.ApprovedBy = assets.ApprovedBy;
        //                existingAsset.ReviewedBy = assets.ReviewedBy;
        //                existingAsset.Remarks = assets.Remarks;
        //                existingAsset.AssignedTillDate = assets.AssignedTillDate;
        //                existingAsset.IsActive = assets.IsActive;
        //                existingAsset.ModifiedBy = assets.CreatedBy;
        //                existingAsset.ModifiedOn = DateTime.Now;
        //                existingAsset.Model = assets.Model;
        //                //existingAsset.SerialNumber = assets.serialNumber;
        //                //existingAsset.productId = assets.SerialNumber;
        //            }
        //            else
        //            {
        //                throw new Exception("Asset Already Exists!");
        //            }
        //        }

        //        var newAsset = new AssetsAssignment();
        //        if (existingAsset != null && existingAsset.IsActive == false)
        //        {
        //            var modelData = _dbContext.AssetMaster.FirstOrDefault(x => x.Id == int.Parse(assets.SerialNumber));
        //            var serialNumber = modelData?.AssetType == "Laptop" ? modelData.SerialNumber : modelData?.Model;

        //            newAsset = new AssetsAssignment
        //            {

        //                AssetName = assets.AssetName,
        //                AssignedUser = assets.AssignedUser,
        //                AssignedBy = assets.AssignedBy,
        //                AssignedDate = assets.AssignedDate,
        //                Specifications = assets.Specifications,
        //                ApprovedBy = assets.ApprovedBy,
        //                ReviewedBy = assets.ReviewedBy,
        //                Remarks = assets.Remarks,
        //                AssignedTillDate = assets.AssignedTillDate,
        //                IsActive = true,
        //                CreatedBy = assets.CreatedBy,
        //                CreatedOn = DateTime.Now,
        //                Model = assets.Model,
        //                SerialNumber = serialNumber,
        //                productId = assets.SerialNumber
        //            };

        //            _dbContext.AssetsAssignment.Add(newAsset);
        //            await _dbContext.SaveChangesAsync();

        //            var assetId = newAsset.Id;  // Get newly inserted asset ID

        //            // Save Asset History
        //            var assetHistory = new assetsHistory
        //            {
        //                assetId = assetId,
        //                AssignedUser = assets.AssignedUser,
        //                AssignedBy = assets.AssignedBy,
        //                AssignedDate = assets.AssignedDate,
        //                Specifications = assets.Specifications,
        //                ApprovedBy = assets.ApprovedBy,
        //                ReviewedBy = assets.ReviewedBy,
        //                Remarks = assets.Remarks,
        //                AssignedTillDate = assets.AssignedTillDate,
        //                IsActive = true,
        //                CreatedBy = assets.CreatedBy,
        //                CreatedOn = DateTime.Now,
        //                Model = assets.Model,
        //                SerialNumber = serialNumber,
        //                productId = assets.SerialNumber
        //            };

        //            _dbContext.assetsHistory.Add(assetHistory);

        //            await _dbContext.SaveChangesAsync(); // Save all attachments at once

        //            var assetHistroyId = assetHistory.Id;  // Get newly inserted asset ID


        //            string folderPath = _configuration["FolderPath1"];
        //            string portalAddress = _configuration["ApiURL"];
        //            string folderName = "/ProfileAttachemants/AssetAttachments/";

        //            // Save Mandate Documents
        //            if (assets.MandateDocuments != null && assets.MandateDocuments.Count > 0)
        //            {
        //                for (int i = 0; i < assets.MandateDocuments.Count; i++)
        //                {
        //                    var file = assets.MandateDocuments[i];
        //                    var fileName = $"{Guid.NewGuid()}_{file.FileName.Replace(" ", "_")}";
        //                    var filePath = Path.Combine(folderPath, fileName);
        //                    string dbFilePath = portalAddress + Path.Combine(folderName, fileName);

        //                    using (var stream = new FileStream(filePath, FileMode.Create))
        //                    {
        //                        await file.CopyToAsync(stream);
        //                    }

        //                    var mandateAssetHistryAttachment = new DocForAssetsHistoryAssignment
        //                    {
        //                        AssetHistoryId = assetHistroyId, // Assign the asset ID
        //                        AttachmentFilePath = filePath,
        //                        DocumentName = file.FileName.Replace(" ", "_") ?? "",
        //                        AttachmentServerPath = dbFilePath,
        //                        AssignedUser = assets.AssignedUser,
        //                        CreatedBy = assets.CreatedBy,
        //                        CreatedOn = DateTime.Now
        //                    };

        //                    _dbContext.DocForAssetsHistoryAssignment.Add(mandateAssetHistryAttachment);

        //                    var mandateAssetAttachment = new MandateDocByAssetsAssignment
        //                    {
        //                        AssetAssignmentId = assetId, // Assign the asset ID
        //                        AttachmentFilePath = filePath,
        //                        DocumentName = file.FileName.Replace(" ", "_") ?? "",
        //                        AttachmentServerPath = dbFilePath,
        //                        AssignedUser = assets.AssignedUser,
        //                        CreatedBy = assets.CreatedBy,
        //                        CreatedOn = DateTime.Now
        //                    };

        //                    _dbContext.MandateDocByAssetsAssignment.Add(mandateAssetAttachment);
        //                }

        //                await _dbContext.SaveChangesAsync(); // Save all attachments at once
        //            }
        //        }
        //        else
        //        {
        //            var deleteMandateDocs = await _dbContext.MandateDocByAssetsAssignment.Where(doc => doc.AssetAssignmentId == existingAsset.Id).ToListAsync();
        //            if (deleteMandateDocs.Any())
        //            {
        //                _dbContext.MandateDocByAssetsAssignment.RemoveRange(deleteMandateDocs);
        //                await _dbContext.SaveChangesAsync();
        //            }

        //            var newAssetHistory = new assetsHistory
        //            {
        //                assetId = existingAsset.Id,
        //                AssignedUser = assets.AssignedUser,
        //                AssignedBy = assets.AssignedBy,
        //                AssignedDate = DateTime.Now,
        //                Specifications = assets.Specifications,
        //                ApprovedBy = assets.ApprovedBy,
        //                ReviewedBy = assets.ReviewedBy,
        //                Remarks = assets.Remarks,
        //                AssignedTillDate = assets.AssignedTillDate,
        //                IsActive = true,
        //                CreatedBy = assets.CreatedBy,
        //                CreatedOn = DateTime.Now,
        //                Model = assets.Model,
        //                SerialNumber = existingAsset.SerialNumber,
        //                productId = existingAsset.SerialNumber
        //            };
        //            _dbContext.assetsHistory.Add(newAssetHistory);

        //            await _dbContext.SaveChangesAsync();

        //            var assetHistroyId = newAssetHistory.Id;  // Get newly inserted asset ID


        //            // **Only Add Attachments if Assigned to a New User**
        //            if (assets.MandateDocuments != null && assets.MandateDocuments.Count > 0)
        //            {
        //                string folderPath = _configuration["FolderPath1"];
        //                string portalAddress = _configuration["ApiURL"];
        //                string folderName = "/ProfileAttachemants/AssetAttachments/";

        //                foreach (var file in assets.MandateDocuments)
        //                {
        //                    var fileName = $"{Guid.NewGuid()}_{file.FileName.Replace(" ", "_")}";
        //                    var filePath = Path.Combine(folderPath, fileName);
        //                    string dbFilePath = portalAddress + Path.Combine(folderName, fileName);

        //                    using (var stream = new FileStream(filePath, FileMode.Create))
        //                    {
        //                        await file.CopyToAsync(stream);
        //                    }


        //                    var mandateAssetHistryAttachment = new DocForAssetsHistoryAssignment
        //                    {
        //                        AssetHistoryId = assetHistroyId, // Assign the asset ID
        //                        AttachmentFilePath = filePath,
        //                        DocumentName = file.FileName.Replace(" ", "_") ?? "",
        //                        AttachmentServerPath = dbFilePath,
        //                        AssignedUser = assets.AssignedUser,
        //                        CreatedBy = assets.CreatedBy,
        //                        CreatedOn = DateTime.Now
        //                    };

        //                    _dbContext.DocForAssetsHistoryAssignment.Add(mandateAssetHistryAttachment);

        //                    var mandateAssetAttachment = new MandateDocByAssetsAssignment
        //                    {
        //                        AssetAssignmentId = existingAsset.Id, // Assign the asset ID
        //                        AttachmentFilePath = filePath,
        //                        DocumentName = file.FileName.Replace(" ", "_") ?? "",
        //                        AttachmentServerPath = dbFilePath,
        //                        AssignedUser = assets.AssignedUser,
        //                        CreatedBy = assets.CreatedBy,
        //                        CreatedOn = DateTime.Now
        //                    };

        //                    _dbContext.MandateDocByAssetsAssignment.Add(mandateAssetAttachment);
        //                }

        //                await _dbContext.SaveChangesAsync(); // Save all at once
        //            }
        //        }

        //        return newAsset;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception(ex.Message ?? "Network Error");
        //    }
        //}


        public async Task<AssetsAssignment> CreateAsset(AssetWithAttachmentDto assets)
        {
            try
            {
                var existingAsset = await _dbContext.AssetsAssignment
            .FirstOrDefaultAsync(t => t.AssetName == assets.AssetName && t.productId == assets.SerialNumber);

                if (existingAsset != null && existingAsset.IsActive && existingAsset.AssignedUser == assets.AssignedUser)
                {
                    throw new Exception("Asset Already Exists!");
                }

                AssetsAssignment newAsset = null;

                if (existingAsset != null && !existingAsset.IsActive)
                {
                    // Reactivating existing asset
                    existingAsset.AssetName = assets.AssetName;
                    existingAsset.AssignedUser = assets.AssignedUser;
                    existingAsset.AssignedBy = assets.AssignedBy;
                    existingAsset.AssignedDate = assets.AssignedDate;
                    existingAsset.Specifications = assets.Specifications;
                    existingAsset.ApprovedBy = assets.ApprovedBy;
                    existingAsset.ReviewedBy = assets.ReviewedBy;
                    existingAsset.Remarks = assets.Remarks;
                    existingAsset.AssignedTillDate = assets.AssignedTillDate;
                    existingAsset.IsActive = assets.IsActive;
                    existingAsset.ModifiedBy = assets.CreatedBy;
                    existingAsset.ModifiedOn = DateTime.Now;
                    existingAsset.Model = assets.Model;
                }
                else
                {
                    var modelData = await _dbContext.AssetMaster.FirstOrDefaultAsync(x => x.Id == int.Parse(assets.SerialNumber));
                    var serialNumber = modelData?.AssetType == "Laptop" ? modelData.SerialNumber : modelData?.Model;

                    newAsset = new AssetsAssignment
                    {
                        AssetName = assets.AssetName,
                        AssignedUser = assets.AssignedUser,
                        AssignedBy = assets.AssignedBy,
                        AssignedDate = assets.AssignedDate,
                        Specifications = assets.Specifications,
                        ApprovedBy = assets.ApprovedBy,
                        ReviewedBy = assets.ReviewedBy,
                        Remarks = assets.Remarks,
                        AssignedTillDate = assets.AssignedTillDate,
                        IsActive = true,
                        CreatedBy = assets.CreatedBy,
                        CreatedOn = DateTime.Now,
                        Model = assets.Model,
                        SerialNumber = serialNumber,
                        productId = assets.SerialNumber
                    };

                    await _dbContext.AssetsAssignment.AddAsync(newAsset);
                    await _dbContext.SaveChangesAsync();
                }

                if (newAsset == null)
                {
                    var deleteMandateDocs = await _dbContext.MandateDocByAssetsAssignment
                        .Where(doc => doc.AssetAssignmentId == existingAsset.Id)
                        .ToListAsync();
                    if (deleteMandateDocs.Any())
                    {
                        _dbContext.MandateDocByAssetsAssignment.RemoveRange(deleteMandateDocs);
                        await _dbContext.SaveChangesAsync();
                    }
                }


                var assetId = (newAsset != null ? newAsset.Id : existingAsset.Id);
                var serialNum = (newAsset != null ? newAsset.SerialNumber : existingAsset.SerialNumber);

                // Save Asset History
                var assetHistory = new assetsHistory
                {
                    assetId = assetId,
                    AssignedUser = assets.AssignedUser,
                    AssignedBy = assets.AssignedBy,
                    AssignedDate = assets.AssignedDate,
                    Specifications = assets.Specifications,
                    ApprovedBy = assets.ApprovedBy,
                    ReviewedBy = assets.ReviewedBy,
                    Remarks = assets.Remarks,
                    AssignedTillDate = assets.AssignedTillDate,
                    IsActive = true,
                    CreatedBy = assets.CreatedBy,
                    CreatedOn = DateTime.Now,
                    Model = assets.Model,
                    SerialNumber = serialNum,
                    productId = assets.SerialNumber
                };

                await _dbContext.assetsHistory.AddAsync(assetHistory);
                await _dbContext.SaveChangesAsync();

                var assetHistoryId = assetHistory.Id;
                string folderPath = _configuration["FolderPath1"];
                string portalAddress = _configuration["ApiURL"];
                string folderName = "/ProfileAttachemants/AssetAttachments/";

                // Save Attachments
                if (assets.MandateDocuments?.Any() == true)
                {
                    var mandateAttachments = new List<DocForAssetsHistoryAssignment>();
                    var mandateAssetAttachments = new List<MandateDocByAssetsAssignment>();

                    foreach (var file in assets.MandateDocuments)
                    {
                        var fileName = $"{Guid.NewGuid()}_{file.FileName.Replace(" ", "_")}";
                        var filePath = Path.Combine(folderPath, fileName);
                        var dbFilePath = portalAddress + Path.Combine(folderName, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        mandateAttachments.Add(new DocForAssetsHistoryAssignment
                        {
                            AssetHistoryId = assetHistoryId,
                            AttachmentFilePath = filePath,
                            DocumentName = file.FileName.Replace(" ", "_") ?? "",
                            AttachmentServerPath = dbFilePath,
                            AssignedUser = assets.AssignedUser,
                            CreatedBy = assets.CreatedBy,
                            CreatedOn = DateTime.Now
                        });

                        mandateAssetAttachments.Add(new MandateDocByAssetsAssignment
                        {
                            AssetAssignmentId = assetId,
                            AttachmentFilePath = filePath,
                            DocumentName = file.FileName.Replace(" ", "_") ?? "",
                            AttachmentServerPath = dbFilePath,
                            AssignedUser = assets.AssignedUser,
                            CreatedBy = assets.CreatedBy,
                            CreatedOn = DateTime.Now
                        });
                    }

                    await _dbContext.DocForAssetsHistoryAssignment.AddRangeAsync(mandateAttachments);
                    await _dbContext.MandateDocByAssetsAssignment.AddRangeAsync(mandateAssetAttachments);
                    await _dbContext.SaveChangesAsync();
                }

                return newAsset ?? existingAsset;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "An error occurred while creating the asset.", ex);
            }
        }


        public async Task<AssetsAssignment> UpdateAsset(int assetId, AssetWithAttachmentDto assetDto)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var existingAsset = await _dbContext.AssetsAssignment.FindAsync(assetId);
                    if (existingAsset == null)
                    {
                        throw new Exception("Asset not found!");
                    }

                    var modelData = _dbContext.AssetMaster.FirstOrDefault(x => x.Id == int.Parse(assetDto.SerialNumber));
                    var serialNumber = modelData?.AssetType == "Laptop" ? modelData.SerialNumber : modelData?.Model;

                    //  var AID = _dbContext.AssetType.Where(x => x.AssetTypeName == assetDto.AssetName).FirstOrDefault();
                    if (existingAsset.AssignedUser == assetDto.AssignedUser)
                    {
                        var EAH = _dbContext.assetsHistory
                            .FirstOrDefault(x => x.assetId == existingAsset.Id && x.AssignedUser == assetDto.AssignedUser);

                        if (EAH != null) // Ensure EAH exists before updating
                        {
                            EAH.AssignedBy = assetDto.AssignedBy;
                            EAH.AssignedDate = assetDto.AssignedDate;
                            EAH.Specifications = assetDto.Specifications;
                            EAH.ApprovedBy = assetDto.ApprovedBy;
                            EAH.ReviewedBy = assetDto.ReviewedBy;
                            EAH.Remarks = assetDto.Remarks;
                            EAH.AssignedTillDate = assetDto.AssignedTillDate;
                            EAH.IsActive = true;
                            EAH.ModifiedBy = assetDto.CreatedBy;
                            EAH.ModifiedOn = DateTime.Now;
                            EAH.Model = assetDto.Model;
                            EAH.SerialNumber = serialNumber;
                            EAH.productId = assetDto.SerialNumber;
                        }


                        if (assetDto.MandateDocuments != null && assetDto.MandateDocuments.Count > 0)
                        {
                            string folderPath = _configuration["FolderPath1"];
                            string portalAddress = _configuration["ApiURL"];
                            string folderName = "/ProfileAttachemants/AssetAttachments/";

                            foreach (var file in assetDto.MandateDocuments)
                            {
                                var fileName = $"{Guid.NewGuid()}_{file.FileName.Replace(" ", "_")}";
                                var filePath = Path.Combine(folderPath, fileName);
                                string dbFilePath = portalAddress + Path.Combine(folderName, fileName);

                                using (var stream = new FileStream(filePath, FileMode.Create))
                                {
                                    await file.CopyToAsync(stream);
                                }

                                var mandateAssetAttachment = new MandateDocByAssetsAssignment
                                {
                                    AssetAssignmentId = assetId, // Assign the asset ID
                                    AttachmentFilePath = filePath,
                                    DocumentName = file.FileName.Replace(" ", "_") ?? "",
                                    AttachmentServerPath = dbFilePath,
                                    AssignedUser = assetDto.AssignedUser,
                                    CreatedBy = assetDto.CreatedBy,
                                    CreatedOn = DateTime.Now
                                };

                                _dbContext.MandateDocByAssetsAssignment.Add(mandateAssetAttachment);
                            }

                            await _dbContext.SaveChangesAsync(); // Save all at once
                        }
                    }
                    else
                    {
                        var deleteMandateDocs = await _dbContext.MandateDocByAssetsAssignment.Where(doc => doc.AssetAssignmentId == existingAsset.Id).ToListAsync();
                        if (deleteMandateDocs.Any())
                        {
                            _dbContext.MandateDocByAssetsAssignment.RemoveRange(deleteMandateDocs);
                            await _dbContext.SaveChangesAsync();
                        }

                        var newAssetHistory = new assetsHistory
                        {
                            assetId = existingAsset.Id,
                            AssignedUser = assetDto.AssignedUser,
                            AssignedBy = assetDto.AssignedBy,
                            AssignedDate = DateTime.Now,
                            Specifications = assetDto.Specifications,
                            ApprovedBy = assetDto.ApprovedBy,
                            ReviewedBy = assetDto.ReviewedBy,
                            Remarks = assetDto.Remarks,
                            AssignedTillDate = assetDto.AssignedTillDate,
                            IsActive = true,
                            CreatedBy = assetDto.CreatedBy,
                            CreatedOn = DateTime.Now,
                            Model = assetDto.Model,
                            SerialNumber = serialNumber,
                            productId = assetDto.SerialNumber
                        };
                        _dbContext.assetsHistory.Add(newAssetHistory);

                        await _dbContext.SaveChangesAsync();

                        var assetHistroyId = newAssetHistory.Id;  // Get newly inserted asset ID


                        // **Only Add Attachments if Assigned to a New User**
                        if (assetDto.MandateDocuments != null && assetDto.MandateDocuments.Count > 0)
                        {
                            string folderPath = _configuration["FolderPath1"];
                            string portalAddress = _configuration["ApiURL"];
                            string folderName = "/ProfileAttachemants/AssetAttachments/";

                            foreach (var file in assetDto.MandateDocuments)
                            {
                                var fileName = $"{Guid.NewGuid()}_{file.FileName.Replace(" ", "_")}";
                                var filePath = Path.Combine(folderPath, fileName);
                                string dbFilePath = portalAddress + Path.Combine(folderName, fileName);

                                using (var stream = new FileStream(filePath, FileMode.Create))
                                {
                                    await file.CopyToAsync(stream);
                                }


                                var mandateAssetHistryAttachment = new DocForAssetsHistoryAssignment
                                {
                                    AssetHistoryId = assetHistroyId, // Assign the asset ID
                                    AttachmentFilePath = filePath,
                                    DocumentName = file.FileName.Replace(" ", "_") ?? "",
                                    AttachmentServerPath = dbFilePath,
                                    AssignedUser = assetDto.AssignedUser,
                                    CreatedBy = assetDto.CreatedBy,
                                    CreatedOn = DateTime.Now
                                };

                                _dbContext.DocForAssetsHistoryAssignment.Add(mandateAssetHistryAttachment);

                                var mandateAssetAttachment = new MandateDocByAssetsAssignment
                                {
                                    AssetAssignmentId = assetId, // Assign the asset ID
                                    AttachmentFilePath = filePath,
                                    DocumentName = file.FileName.Replace(" ", "_") ?? "",
                                    AttachmentServerPath = dbFilePath,
                                    AssignedUser = assetDto.AssignedUser,
                                    CreatedBy = assetDto.CreatedBy,
                                    CreatedOn = DateTime.Now
                                };

                                _dbContext.MandateDocByAssetsAssignment.Add(mandateAssetAttachment);
                            }

                            await _dbContext.SaveChangesAsync(); // Save all at once
                        }
                    }

                    // Update Existing Asset
                    existingAsset.AssetName = assetDto.AssetName;
                    existingAsset.AssignedUser = assetDto.AssignedUser;
                    existingAsset.AssignedBy = assetDto.AssignedBy;
                    existingAsset.AssignedDate = assetDto.AssignedDate;
                    existingAsset.Specifications = assetDto.Specifications;
                    existingAsset.ApprovedBy = assetDto.ApprovedBy;
                    existingAsset.ReviewedBy = assetDto.ReviewedBy;
                    existingAsset.Remarks = assetDto.Remarks;
                    existingAsset.AssignedTillDate = assetDto.AssignedTillDate;
                    existingAsset.IsActive = assetDto.IsActive;
                    existingAsset.ModifiedBy = assetDto.CreatedBy;
                    existingAsset.ModifiedOn = DateTime.Now;
                    existingAsset.Model = assetDto.Model;
                    existingAsset.SerialNumber = serialNumber;
                    existingAsset.productId = assetDto.SerialNumber;

                    _dbContext.Entry(existingAsset).State = EntityState.Modified;
                    await _dbContext.SaveChangesAsync();

                    await transaction.CommitAsync();
                    return existingAsset;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
        }
        public async Task<AssetsAssignment> DeleteAsset(int id)
        {
            try
            {
                var asset = await _dbContext.AssetsAssignment.FindAsync(id);
                if (asset == null)
                {
                    throw new Exception("Asset not found!");
                }

                _dbContext.AssetsAssignment.Remove(asset);
                await _dbContext.SaveChangesAsync();

                return asset;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<bool> DeleteMandateDocAttachmentAsync(int mandateDocId)
        {
            var mandateDoc = await _dbContext.MandateDocByAssetsAssignment.FindAsync(mandateDocId);
            if (mandateDoc == null)
            {
                return false; // Document not found
            }

            _dbContext.MandateDocByAssetsAssignment.Remove(mandateDoc);
            await _dbContext.SaveChangesAsync();

            // Optional: Delete the file from the server if it exists
            if (!string.IsNullOrEmpty(mandateDoc.AttachmentServerPath))
            {
                try
                {
                    if (File.Exists(mandateDoc.AttachmentServerPath))
                    {
                        File.Delete(mandateDoc.AttachmentServerPath);
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

        public async Task<(string Key, int Value)[]> GetTotalAssetCounts()
        {
            // Count distinct active assets in AssetMaster
            int totalAssetCount = await _dbContext.AssetMaster
                .Where(a => a.IsActive == true) // Only active assets
                .Select(a => a.Id)
                .Distinct()
                .CountAsync();

            // Count distinct assignments in AssetsAssignment
            int totalAssetsInUse = await _dbContext.AssetsAssignment
    .Where(aa => aa.IsActive)
    .Select(aa => aa.productId)
    .Distinct()
    .CountAsync();


            // Count discarded (inactive) assets in AssetMaster
            int totalDiscarded = await _dbContext.AssetMaster
                .Where(a => a.IsActive == false) // Only inactive assets
                .Select(a => a.Id)
                .Distinct()
                .CountAsync();

            // Calculate available assets
            int totalAssetsAvailable = totalAssetCount - totalAssetsInUse;

            return new (string Key, int Value)[]
            {
        ("totalAssetCount", totalAssetCount),
        ("totalAssetsInUse", totalAssetsInUse),
        ("totalAssetsAvailable", totalAssetsAvailable),
        ("totalDiscarded", totalDiscarded) // Inactive assets
            };
        }


        public async Task<List<AssetMasterForData>> GetAssignedAssets(string status)
        {
            var result = new List<AssetMasterForData>();

            if (status == "assigned")
            {
                var assignedAssetsData = await _dbContext.AssetMaster.Where(a => a.IsActive == true).ToListAsync();
                foreach (var asset in assignedAssetsData)
                {
                    var assetAssignmantData = await _dbContext.AssetsAssignment.FirstOrDefaultAsync(any => any.productId == asset.Id.ToString() && any.IsActive);
                    if (assetAssignmantData != null)
                    {
                        result.Add(new AssetMasterForData()
                        {
                            AssetType = asset.AssetType,
                            Model = asset.Model,
                            SerialNumber = asset.SerialNumber,
                            Processor = asset.Processor,
                            Genration = asset.Genration,
                            RAM = asset.RAM,
                            HDD = asset.HDD,
                            PurchaseDate = asset.PurchaseDate,
                            VendorName = asset.VendorName,
                            WarrantyStatus = asset.WarrantyStatus,
                            OS = asset.OS,
                            PreviousUser = asset.PreviousUser,
                            ChargerType = asset.ChargerType,
                            Location = asset.Location,
                            SpecificationIfAny = asset.SpecificationIfAny,
                            ModifiedBy = asset.ModifiedBy,
                            accessoriesType = asset.accessoriesType,
                            Assigned = assetAssignmantData.AssignedUser
                        });
                    }
                }
            }
            else if (status == "notAssigned")
            {
                var unassignedAssetsData = await _dbContext.AssetMaster.Where(a => a.IsActive == true).ToListAsync();
                foreach (var asset in unassignedAssetsData)
                {
                    var assetAssignmantData = await _dbContext.AssetsAssignment.FirstOrDefaultAsync(any => any.productId == asset.Id.ToString() && any.IsActive);
                    if (assetAssignmantData == null)
                    {
                        result.Add(new AssetMasterForData()
                        {
                            AssetType = asset.AssetType,
                            Model = asset.Model,
                            SerialNumber = asset.SerialNumber,
                            Processor = asset.Processor,
                            Genration = asset.Genration,
                            RAM = asset.RAM,
                            HDD = asset.HDD,
                            PurchaseDate = asset.PurchaseDate,
                            VendorName = asset.VendorName,
                            WarrantyStatus = asset.WarrantyStatus,
                            OS = asset.OS,
                            PreviousUser = asset.PreviousUser,
                            ChargerType = asset.ChargerType,
                            Location = asset.Location,
                            SpecificationIfAny = asset.SpecificationIfAny,
                            ModifiedBy = asset.ModifiedBy,
                            accessoriesType = asset.accessoriesType,
                            Assigned = "Not Found"
                        });
                    }
                }
            }
            else if (status == "total")
            {
                var totalAssetsData = await _dbContext.AssetMaster.Where(a => a.IsActive == true).ToListAsync();
                foreach (var asset in totalAssetsData)
                {
                    var assetAssignmantData = await _dbContext.AssetsAssignment.FirstOrDefaultAsync(any => any.productId == asset.Id.ToString() && any.IsActive);
                    result.Add(new AssetMasterForData()
                    {
                        AssetType = asset.AssetType,
                        Model = asset.Model,
                        SerialNumber = asset.SerialNumber,
                        Processor = asset.Processor,
                        Genration = asset.Genration,
                        RAM = asset.RAM,
                        HDD = asset.HDD,
                        PurchaseDate = asset.PurchaseDate,
                        VendorName = asset.VendorName,
                        WarrantyStatus = asset.WarrantyStatus,
                        OS = asset.OS,
                        PreviousUser = asset.PreviousUser,
                        ChargerType = asset.ChargerType,
                        Location = asset.Location,
                        SpecificationIfAny = asset.SpecificationIfAny,
                        ModifiedBy = asset.ModifiedBy,
                        accessoriesType = asset.accessoriesType,
                        Assigned = assetAssignmantData != null ? assetAssignmantData.AssignedUser : "Not Found"
                    });
                }
            }
            else if (status == "discarded")
            {
                var discardedAssetsData = await _dbContext.AssetMaster.Where(a => a.IsActive == false).ToListAsync();
                foreach (var asset in discardedAssetsData)
                {
                    result.Add(new AssetMasterForData()
                    {
                        AssetType = asset.AssetType,
                        Model = asset.Model,
                        SerialNumber = asset.SerialNumber,
                        Processor = asset.Processor,
                        Genration = asset.Genration,
                        RAM = asset.RAM,
                        HDD = asset.HDD,
                        PurchaseDate = asset.PurchaseDate,
                        VendorName = asset.VendorName,
                        WarrantyStatus = asset.WarrantyStatus,
                        OS = asset.OS,
                        PreviousUser = asset.PreviousUser,
                        ChargerType = asset.ChargerType,
                        Location = asset.Location,
                        SpecificationIfAny = asset.SpecificationIfAny,
                        ModifiedBy = asset.ModifiedBy,
                        accessoriesType = asset.accessoriesType,
                        Assigned = "Discarded"
                    });
                }
            }

            return result;
        }

        //public async Task<List<AssetMasterForData>> GetAssignedAssets(string status)
        //{
        //    var result = new List<AssetMasterForData>();

        //    if (status == "assigned")
        //    {
        //        var assignedAssetsData = await _dbContext.AssetMaster.ToListAsync();
        //        foreach (var asset in assignedAssetsData)
        //        {
        //            var assetAssignmantData = await _dbContext.AssetsAssignment.FirstOrDefaultAsync(any => any.productId == asset.Id.ToString());
        //            if (assetAssignmantData != null)
        //            {

        //                var data = new AssetMasterForData()
        //                {
        //                    AssetType = asset.AssetType,
        //                    Model = asset.Model,
        //                    SerialNumber = asset.SerialNumber,
        //                    Processor = asset.Processor,
        //                    Genration = asset.Genration,
        //                    RAM = asset.RAM,
        //                    HDD = asset.HDD,
        //                    PurchaseDate = asset.PurchaseDate,
        //                    VendorName = asset.VendorName,
        //                    WarrantyStatus = asset.WarrantyStatus,
        //                    OS = asset.OS,
        //                    PreviousUser = asset.PreviousUser,
        //                    ChargerType = asset.ChargerType,
        //                    Location = asset.Location,
        //                    SpecificationIfAny = asset.SpecificationIfAny,
        //                    ModifiedBy = asset.ModifiedBy,
        //                    accessoriesType = asset.accessoriesType,
        //                    Assigned = assetAssignmantData.AssignedUser
        //                };
        //                result.Add(data);
        //            }
        //        }

        //        //result.AddRange(assignedAssets);
        //    }
        //    else if (status == "notAssigned")
        //    {

        //        var assignedAssetsData = await _dbContext.AssetMaster.ToListAsync();
        //        foreach (var asset in assignedAssetsData)
        //        {
        //            var assetAssignmantData = await _dbContext.AssetsAssignment.FirstOrDefaultAsync(any => any.productId == asset.Id.ToString());
        //            if (assetAssignmantData == null)
        //            {

        //                var data = new AssetMasterForData()
        //                {
        //                    AssetType = asset.AssetType,
        //                    Model = asset.Model,
        //                    SerialNumber = asset.SerialNumber,
        //                    Processor = asset.Processor,
        //                    Genration = asset.Genration,
        //                    RAM = asset.RAM,
        //                    HDD = asset.HDD,
        //                    PurchaseDate = asset.PurchaseDate,
        //                    VendorName = asset.VendorName,
        //                    WarrantyStatus = asset.WarrantyStatus,
        //                    OS = asset.OS,
        //                    PreviousUser = asset.PreviousUser,
        //                    ChargerType = asset.ChargerType,
        //                    Location = asset.Location,
        //                    SpecificationIfAny = asset.SpecificationIfAny,
        //                    ModifiedBy = asset.ModifiedBy,
        //                    accessoriesType = asset.accessoriesType,
        //                    Assigned = "Not Found"
        //                };
        //                result.Add(data);
        //            }
        //        }

        //    }
        //    else if (status == "total")
        //    {

        //        var assignedAssetsData = await _dbContext.AssetMaster.ToListAsync();
        //        foreach (var asset in assignedAssetsData)
        //        {
        //            var assetAssignmantData = await _dbContext.AssetsAssignment.FirstOrDefaultAsync(any => any.productId == asset.Id.ToString());
        //            if (assetAssignmantData != null)
        //            {

        //                var data = new AssetMasterForData()
        //                {
        //                    AssetType = asset.AssetType,
        //                    Model = asset.Model,
        //                    SerialNumber = asset.SerialNumber,
        //                    Processor = asset.Processor,
        //                    Genration = asset.Genration,
        //                    RAM = asset.RAM,
        //                    HDD = asset.HDD,
        //                    PurchaseDate = asset.PurchaseDate,
        //                    VendorName = asset.VendorName,
        //                    WarrantyStatus = asset.WarrantyStatus,
        //                    OS = asset.OS,
        //                    PreviousUser = asset.PreviousUser,
        //                    ChargerType = asset.ChargerType,
        //                    Location = asset.Location,
        //                    SpecificationIfAny = asset.SpecificationIfAny,
        //                    ModifiedBy = asset.ModifiedBy,
        //                    accessoriesType = asset.accessoriesType,
        //                    Assigned = assetAssignmantData.AssignedUser
        //                };
        //                result.Add(data);
        //            }
        //            else
        //            {

        //                var data = new AssetMasterForData()
        //                {
        //                    AssetType = asset.AssetType,
        //                    Model = asset.Model,
        //                    SerialNumber = asset.SerialNumber,
        //                    Processor = asset.Processor,
        //                    Genration = asset.Genration,
        //                    RAM = asset.RAM,
        //                    HDD = asset.HDD,
        //                    PurchaseDate = asset.PurchaseDate,
        //                    VendorName = asset.VendorName,
        //                    WarrantyStatus = asset.WarrantyStatus,
        //                    OS = asset.OS,
        //                    PreviousUser = asset.PreviousUser,
        //                    ChargerType = asset.ChargerType,
        //                    Location = asset.Location,
        //                    SpecificationIfAny = asset.SpecificationIfAny,
        //                    ModifiedBy = asset.ModifiedBy,
        //                    accessoriesType = asset.accessoriesType,
        //                    Assigned = "Not Found"
        //                };
        //                result.Add(data);
        //            }
        //        }
        //    }

        //    return result;
        //}
    }
}
