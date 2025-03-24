using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace AuthApplication.Models
{

    public class CommonClass
    {
        public bool IsActive { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
    }
    

    public class ProjectTask : CommonClass
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TaskId { get; set; }

        public int ProjectId { get; set; }
        public string? TaskName { get; set; }
        public string? Discription { get; set; }
        public string? ResourceWorking { get; set; }
        public DateTime? DateAssignedTask { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? ProposedDuration { get; set; }
        public string? ActualDuration { get; set; }
        public bool? IsParallelProcess { get; set; }
        public string? TaskStatus { get; set; }
        public string? AssignedBy { get; set; }
        public string? Remark { get; set; }
    }

    public class Models1
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? ModelName { get; set; }
        public string? AccetType { get; set; }
    }
    public class PMOAttachment : CommonClass
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AttachmentID { get; set; }
        public string ProjectId { get; set; }
        public string? ActualDocName { get; set; }
        public string? AttachmentName { get; set; }
        public string ContentType { get; set; }
        public long ContentLength { get; set; }
        public string? FilePath { get; set; }
        public string? AttachmentFile { get; set; }
    }

    public class TaskAttachment : CommonClass
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AttachmentID { get; set; }
        public string UptId { get; set; }
        public string? ActualDocName { get; set; }
        public string? AttachmentName { get; set; }
        public string ContentType { get; set; }
        public long ContentLength { get; set; }
        public string? FilePath { get; set; }
        public string? AttachmentFile { get; set; }
    }

    public class ProjectTaskAttachment : CommonClass
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AttachmentID { get; set; }
        public string TaskId { get; set; }
        public string? ActualDocName { get; set; }
        public string? AttachmentName { get; set; }
        public string ContentType { get; set; }
        public long ContentLength { get; set; }
        public string? FilePath { get; set; }
        public string? AttachmentFile { get; set; }
    }

    public class ProjectTaskManager : CommonClass
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PTaskId { get; set; }
        public string TaskName { get; set; }
        public string Description { get; set; }
        public string Technologies { get; set; }
        public string? ProposedDuration { get; set; }
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualFinishDate { get; set; }
        public bool? IsParallelProcess { get; set; }
    }

    public class ProjectTaskManagerDTO
    {
        public string TaskName { get; set; }
        public string Description { get; set; }
        public string Technologies { get; set; }
        public string? ProposedDuration { get; set; }
        public string? ActualStartDate { get; set; }
        public string? ActualFinishDate { get; set; }
        public bool? IsParallelProcess { get; set; }
        public string? CreatedBy { get; set; }
    }
    public class TechnologiesMaster
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TechId { get; set; }
        public string? Description { get; set; }
    }

    public class ProjectWithAttachmentsDTO
    {

        public string? ProjectName { get; set; }
        public string? Discription { get; set; }
        public string? ClientName { get; set; }
        public string? ClientSpoc { get; set; }
        public string? IteosSpoc { get; set; }
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        public string? ProjectKickoff { get; set; }
        public string? ProjectStatus { get; set; }
        public string? BrdStatus { get; set; }
        public string? AssignedManagerId { get; set; }
        public string? ProjectType { get; set; }
        public string? ProjectTechnologies { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public string? DeleteDocIds { get; set; }
        public List<string>? DocumentsName { get; set; }
        // public List<IFormFile>? Attachments { get; set; }
        public List<IFormFile> Attachments { get; set; } = new List<IFormFile>();
    }

    public class ProjectTaskWithAttchmentsDTO
    {
        public int? TaskId { get; set; }
        public int ProjectId { get; set; }
        public string? TaskName { get; set; }
        public string? Discription { get; set; }
        public string? ResourceWorking { get; set; }
        public DateTime? DateAssignedTask { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? ProposedDuration { get; set; }
        public string? ActualDuration { get; set; }
        public bool? IsParallelProcess { get; set; }
        public string? TaskStatus { get; set; }
        public string? AssignedBy { get; set; }
        public string? Remark { get; set; }
        public string? CreatedBy { get; set; }
        public string? DeleteDocIds { get; set; }
        public List<string>? DocumentsName { get; set; }
        public List<IFormFile>? Attachments { get; set; }

    }

    public class ProjectWithAttachmentsDTOData
    {
        public int ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public string? Discription { get; set; }
        public string? ClientName { get; set; }
        public string? ClientSpoc { get; set; }
        public string? IteosSpoc { get; set; }
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        public string? ProjectKickoff { get; set; }
        public string? ProjectStatus { get; set; }
        public string? BrdStatus { get; set; }
        public string? AssignedManagerId { get; set; }
        public string? ProjectType { get; set; }
        public string? ProjectTechnologies { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public List<PMOAttachment>? Attachments { get; set; }
    }

    public class ProjectTaskWithAttachmentsDTO
    {
        public int UptId { get; set; }
        public string? StatusOfTask { get; set; }
        public string? Remarks { get; set; }
        public string? CreatedBy { get; set; }
        public string? DeleteDocIds { get; set; }
        public List<string>? DocumentsName { get; set; }
        public List<IFormFile>? Attachments { get; set; }
    }
    public class ProjectTaskForUserData
    {
        public int TaskId { get; set; }
        public int ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public string? TaskName { get; set; }
        public string? Discription { get; set; }
        public string? ResourceWorking { get; set; }
        public DateTime? DateAssignedTask { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? ProposedDuration { get; set; }
        public string? ActualDuration { get; set; }
        public bool? IsParallelProcess { get; set; }
        public string? TaskStatus { get; set; }
        public string? AssignedBy { get; set; }
        public string? Remark { get; set; }
        public bool? IsActive { get; set; }
        public List<ProjectTaskAttachment>? Attachments { get; set; }
        public UserTaskWithAttachmentsData? UserTaskData { get; set; }
    }
    public class ProjectTaskForManagerData
    {
        public int TaskId { get; set; }
        public int ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public string? TaskName { get; set; }
        public string? Discription { get; set; }
        public string? ResourceWorking { get; set; }
        public DateTime? DateAssignedTask { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? ProposedDuration { get; set; }
        public string? ActualDuration { get; set; }
        public bool? IsParallelProcess { get; set; }
        public string? TaskStatus { get; set; }
        public string? AssignedBy { get; set; }
        public string? Remark { get; set; }
        public bool? IsActive { get; set; }
        public List<ProjectTaskAttachment>? Attachments { get; set; }
        public List<UserTaskWithAttachmentsData>? AssignTaskData { get; set; }
    }
    public class UserTaskWithAttachmentsData
    {
        public int UptId { get; set; }
        public Guid UserID { get; set; }
        public string? StatusOfTask { get; set; }
        public string? Remarks { get; set; }
        public string? CreatedBy { get; set; }
        public List<TaskAttachment>? TaskAttachments { get; set; }
    }
    public class AssetsAssignment
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? AssetName { get; set; }
        public string? AssignedUser { get; set; }
        public string? AssignedBy { get; set; }
        public DateTime? AssignedDate { get; set; }
        public string? Specifications { get; set; }
        public string? ApprovedBy { get; set; }
        public string? ReviewedBy { get; set; }
        public string? Remarks { get; set; }
        public DateTime? AssignedTillDate { get; set; }
        public bool IsActive { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public string? SerialNumber { get; set; }
        public string? productId { get; set; }
        public string? Model { get; set; }
    }
    public class AssetsAssignmentWithAttachment
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? AssetName { get; set; }
        public string? AssignedUser { get; set; }
        public string? AssignedBy { get; set; }
        public DateTime? AssignedDate { get; set; }
        public string? Specifications { get; set; }
        public string? ApprovedBy { get; set; }
        public string? ReviewedBy { get; set; }
        public string? Remarks { get; set; }
        public DateTime? AssignedTillDate { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public string? SerialNumber { get; set; }
        public string? productId { get; set; }
        public string? Model { get; set; }
        public List<MandateDocByAssetsAssignment>? MandateDocByAssetsAssignment { get; set; }

    }

    public class assetsHistory
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int  assetId { get; set; }
        public string? AssignedUser { get; set; }
        public string? AssignedBy { get; set; }
        public DateTime? AssignedDate { get; set; }
        public string? Specifications { get; set; }
        public string? ApprovedBy { get; set; }
        public string? ReviewedBy { get; set; }
        public string? Remarks { get; set; }
        public DateTime? AssignedTillDate { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public string? SerialNumber { get; set; }
        public string? Model { get; set; }
        public string? productId { get; set; }
    }

    public class AssetsHistoryDataattach
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int assetId { get; set; }
        public string? AssignedUser { get; set; }
        public string? AssignedBy { get; set; }
        public DateTime? AssignedDate { get; set; }
        public string? Specifications { get; set; }
        public string? ApprovedBy { get; set; }
        public string? ReviewedBy { get; set; }
        public string? Remarks { get; set; }
        public DateTime? AssignedTillDate { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public string? SerialNumber { get; set; }
        public string? Model { get; set; }
        public string? productId { get; set; }
        public List<DocForAssetsHistoryAssignment>? DocForAssetsHistoryAssignment { get; set; }
    }

    public class AssetWithAttachmentDto
    {
        public string? AssetName { get; set; }
        public string? AssignedUser { get; set; }
        public string? AssignedBy { get; set; }
        public DateTime? AssignedDate { get; set; }
        public string? Specifications { get; set; }
        public string? ApprovedBy { get; set; }
        public string? ReviewedBy { get; set; }
        public string? Remarks { get; set; }
        public DateTime? AssignedTillDate { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        //public string? DeleteDocIds { get; set; }
        public bool IsActive { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public string? SerialNumber { get; set; }
        public string? Model { get; set; }
        public string? productId { get; set; }

        [FromForm(Name = "mandateAttchment")]
        public List<IFormFile>? MandateDocuments { get; set; } = new List<IFormFile>();
        //public List<string>? Issues { get; set; }

        //[FromForm(Name = "attachments")]
        //public List<IFormFile>? Attachments { get; set; } = new List<IFormFile>();
    }



    public class AssetMaster
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? AssetType { get; set; }
        public string? Model { get; set; }
        public string? SerialNumber { get; set; }
        public string? Processor { get; set; }
        public string? Genration { get; set; }
        public string? RAM { get; set; }
        public string? HDD { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public string? VendorName { get; set; }
        public string? WarrantyStatus { get; set; }
        public string? OS { get; set; }
        public string? PreviousUser { get; set; }
        public string? Remarks { get; set; }
        public string? ChargerAllocation { get; set; }
        public string? ChargerType { get; set; }
        public string? Location { get; set; }
        public string? SpecificationIfAny { get; set; }

        public bool? IsActive { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public string? accessoriesType { get; set; }
        public string? Brand { get; set; }

    }

    public class AssetMasterModel
    {
        public int Id { get; set; }
        public string? AssetType { get; set; }
        public string? Model { get; set; }
        public string? SerialNumber { get; set; }
        public string? Processor { get; set; }
        public string? Genration { get; set; }
        public string? RAM { get; set; }
        public string? HDD { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public string? VendorName { get; set; }
        public string? WarrantyStatus { get; set; }
        public string? OS { get; set; }
        public string? PreviousUser { get; set; }
        public string? Remarks { get; set; }
        public string? ChargerAllocation { get; set; }
        public string? ChargerType { get; set; }
        public string? Location { get; set; }
        public string? SpecificationIfAny { get; set; }

        public bool? IsActive { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public string? accessoriesType { get; set; }
        public string? Brand { get; set; }
        public List<MandateDocAsset>? mandateDocAsset { get; set; }
        public List<AttachmentMaster>? attachmentMasters { get; set; }

    }
    public class DeviceMasterWithIssuesDto
    {
        
        public int deviceId { get; set; }
        public string? AssetType { get; set; }
        public string? Model { get; set; }
        public string? SerialNumber { get; set; }
        public string? Processor { get; set; }
        public string? Genration { get; set; }
        public string? RAM { get; set; }
        public string? HDD { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public string? VendorName { get; set; }
        public string? WarrantyStatus { get; set; }
        public string? OS { get; set; }
        public string? PreviousUser { get; set; }
        public string? Remarks { get; set; }
        public string? ChargerAllocation { get; set; }
        public string? ChargerType { get; set; }
        public string? Location { get; set; }
        public string? SpecificationIfAny { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public string? DeleteDocIds { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public List<string>? DocumentName { get; set; }
        public string? accessoriesType { get; set; }

        [FromForm(Name = "mandateAttchment")]
        public List<IFormFile>? MandateDocuments { get; set; } = new List<IFormFile>();
        public string? Brand { get; set; }

        [FromForm(Name = "attachments")]
        public List<IFormFile>? Attachments { get; set; } = new List<IFormFile>();

    }
    public class AttachmentMaster
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int AssetId { get; set; }
        public string? AttachmentFilePath { get; set; }
        public string? DocumentName { get; set; }
        public string? AttachmentServerPath { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public string? FileName { get; set; }
    }

    public class MandateDocAsset
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AttachId { get; set; }
        public int AssetId { get; set; }
        public string? AttachmentFilePath { get; set; }
        public string? DocumentName { get; set; }
        public string? AttachmentServerPath { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
    }


    public class DeleteAttachmentRequest
    {
        public int AttachId { get; set; }
    }


    public class MandateDocByAssetsAssignment
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MandateDocId { get; set; }
        public string? AssignedUser { get; set; }
        public int AssetAssignmentId { get; set; }
        public string? AttachmentFilePath { get; set; }
        public string? DocumentName { get; set; }
        public string? AttachmentServerPath { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
    }

    public class DeleteMandateDocRequest
    {
        public int MandateDocId { get; set; }
    }


    public class DocForAssetsHistoryAssignment
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MandateDocId { get; set; }
        public string? AssignedUser { get; set; }
        public int AssetHistoryId { get; set; }
        public string? AttachmentFilePath { get; set; }
        public string? DocumentName { get; set; }
        public string? AttachmentServerPath { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
    public class Issues
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string AssetId { get; set; }
        public string? IssueDescription { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }

    }

    public class AssetType
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? AssetTypeName { get; set; }
    }
    public class AssetTypeDto
    {
        public string? AssetTypeName { get; set; }
    }
   
    public class ModelsDto
    {
        public string? ModelName { get; set; }
        public string? AccetType { get; set; }
    }
    public class Processor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? ProcessorName { get; set; }
    }
    public class ProcessorDto
    {
        public string? ProcessorName { get; set; }
    }
    public class Genration
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? GenrationName { get; set; }
    }

    public class GenrationDto
    {
        public string? GenrationName { get; set; }
    }
    public class RAM
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? RAMName { get; set; }
    }

    public class RAMDto
    {
        public string? RAMName { get; set; }
    }
    public class HDD
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? HDDName { get; set; }
    }

    public class HDDDto
    {      
        public string? HDDName { get; set; }
    }
    public class WarrantyStatus
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? Warranty { get; set; }
    }

    public class WarrantyStatusDto
    {
        public string? Warranty { get; set; }
    }
    public class OS
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? OSName { get; set; }
    }

    public class OSDto
    {
        public string? OSName { get; set; }
    }
    public class Charger
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? ChargerName { get; set; }
    }

    public class ChargerDto
    {
        public string? ChargerName { get; set; }
    }
    public class ChargerType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? ChargerTypeName { get; set; }
    }
   
    public class ChargerTypeDto
    {
        public string? ChargerTypeName { get; set; }
    }
    public class AccessoriesType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? AccessoriesTypeName { get; set; }
    }

    public class TicketType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TTId { get; set; }

        [Required]
        [StringLength(100)]
        public string TicketTypeName { get; set; } = null!;
    }

    public class HardwareType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int HTId { get; set; }

        [Required]
        [StringLength(100)]
        public string HardwareTypeName { get; set; } = null!;
    }

    public class SoftwareType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int STId { get; set; }

        [Required]
        [StringLength(100)]
        public string SoftwareTypeName { get; set; } = null!;
    }

    public class TicketTypeDto
    {
        public string TicketTypeName { get; set; } = null!;
    }

    public class HardwareTypeDto
    {
        public string HardwareTypeName { get; set; } = null!;
    }

    public class SoftwareTypeDto
    {
        public string SoftwareTypeName { get; set; } = null!;
    }

    public class Tickets
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TicketId { get; set; } // PascalCase for consistency

        [StringLength(100)]
        public string? AssignedUser { get; set; } // Optional, with length constraint

        [Required]
        [StringLength(50)]
        public string TicketType { get; set; } = null!; // Required field

        [Required]
        [StringLength(50)]
        public string IssueType { get; set; } = null!; // Required field

        [Required]
        [StringLength(200)]
        public string IssueSubject { get; set; } = null!; // Required, with reasonable length

        [StringLength(1000)]
        public string? IssueDescription { get; set; } // Optional, longer length for details

        [StringLength(500)]
        public string? AssignerRemarks { get; set; } // Optional, with length constraint

        public TicketStatusEnum TicketStatus { get; set; } = TicketStatusEnum.Open;
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow; // Default to current UTC time

        [Required]
        [StringLength(100)]
        public string CreatedBy { get; set; } = null!; // Required field

        public DateTime? ModifiedOn { get; set; } // Nullable for optional updates

        [StringLength(100)]
        public string? ModifiedBy { get; set; } // Optional field
    }
    public class TicketsView
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TicketId { get; set; } // PascalCase for consistency

        [StringLength(100)]
        public string? AssignedUser { get; set; } // Optional, with length constraint

        [Required]
        [StringLength(50)]
        public string TicketType { get; set; } = null!; // Required field

        [Required]
        [StringLength(50)]
        public string IssueType { get; set; } = null!; // Required field

        [Required]
        [StringLength(200)]
        public string IssueSubject { get; set; } = null!; // Required, with reasonable length

        [StringLength(1000)]
        public string? IssueDescription { get; set; } // Optional, longer length for details

        [StringLength(500)]
        public string? AssignerRemarks { get; set; } // Optional, with length constraint

        public TicketStatusEnum TicketStatus { get; set; } = TicketStatusEnum.Open;
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow; // Default to current UTC time

        [Required]
        [StringLength(100)]
        public string CreatedBy { get; set; } = null!; // Required field

        public DateTime? ModifiedOn { get; set; } // Nullable for optional updates

        [StringLength(100)]
        public string? ModifiedBy { get; set; } // Optional field
        public List<TicketAttachment>? TicketAttachments { get; set; }

    }
    public class TicketDto
    {
       
        public int TicketId { get; set; } // PascalCase for consistency

        [StringLength(100)]
        public string? AssignedUser { get; set; } // Optional, with length constraint

        [Required]
        [StringLength(50)]
        public string TicketType { get; set; } = null!; // Required field

        [Required]
        [StringLength(50)]
        public string IssueType { get; set; } = null!; // Required field

        [Required]
        [StringLength(200)]
        public string IssueSubject { get; set; } = null!; // Required, with reasonable length

        [StringLength(1000)]
        public string? IssueDescription { get; set; } // Optional, longer length for details

        [StringLength(500)]
        public string? AssignerRemarks { get; set; } // Optional, with length constraint

        public TicketStatusEnum TicketStatus { get; set; } = TicketStatusEnum.Open;

        [Required]
        [StringLength(100)]
        public string CreatedBy { get; set; } = null!; // Required field

        [FromForm(Name = "TicketAttchment")]
        public List<IFormFile>? TicketAttchment { get; set; } = new List<IFormFile>();

    }

    public enum TicketStatusEnum
    {
        Open = 0,
        InProgress = 1,
        Hold = 2,
        Closed = 3
    }

    public class TicketAttachment
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AttachId { get; set; }

        [Required]
        public int TicketId { get; set; } // Renamed from AssetId to link to Tickets

        [StringLength(500)] // Optional: Adding a reasonable length
        public string? AttachmentFilePath { get; set; }

        [StringLength(100)] // Optional: Adding a reasonable length
        public string? DocumentName { get; set; }

        [StringLength(500)] // Optional: Adding a reasonable length
        public string? AttachmentServerPath { get; set; }

        [StringLength(100)] // Optional: Adding a reasonable length
        public string? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; } = DateTime.UtcNow; // Optional: Adding a default
    }

    public class AccessoriesTypeDto
    {
        public string? AccessoriesTypeName { get; set; }
    }
    public class AssetDetailsFrom2TablesDto
    {
        // Fields from AssetsAssignment
        public string AssignedUser { get; set; }
        public string AssignedBy { get; set; }
        public DateTime? AssignedDate { get; set; }
        public DateTime? AssignedTillDate { get; set; }

        // Fields from AssetMaster
        public string Model { get; set; }
        public string SerialNumber { get; set; }
        public string Processor { get; set; }
        public string Generation { get; set; }
        public string RAM { get; set; }
        public string HDD { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public string VendorName { get; set; }
        public string WarrantyStatus { get; set; }
    }

    public class AssetMasterForData
    {
        public string? AssetType { get; set; }
        public string? Model { get; set; }
        public string? SerialNumber { get; set; }
        public string? Processor { get; set; }
        public string? Genration { get; set; }
        public string? RAM { get; set; }
        public string? HDD { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public string? VendorName { get; set; }
        public string? WarrantyStatus { get; set; }
        public string? OS { get; set; }
        public string? PreviousUser { get; set; }
        public string? ChargerType { get; set; }
        public string? Location { get; set; }
        public string? SpecificationIfAny { get; set; }
        public string? ModifiedBy { get; set; }
        public string? accessoriesType { get; set; }
        public string? Assigned { get; set; }

    }
}
