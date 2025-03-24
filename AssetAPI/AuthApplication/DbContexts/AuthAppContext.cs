using System;
using AuthApplication.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthApplication.DbContexts
{
	public class AuthAppContext : DbContext
	{
		public AuthAppContext(DbContextOptions<AuthAppContext> options):base(options){ }

        public DbSet<Client> Clients { get; set; }
        //public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRoleMap> UserRoleMaps { get; set; }
        public DbSet<App> Apps { get; set; }
        public DbSet<RoleAppMap> RoleAppMaps { get; set; }
        public DbSet<UserLoginHistory> UserLoginHistory { get; set; }
        public DbSet<AuthTokenHistory> AuthTokenHistories { get; set; }
        public DbSet<EmailConfiguration> EmailConfiguration { get; set; }
        public DbSet<otpConfiguration> otpConfiguration { get; set; }
        public DbSet<PasswordResetOtpHistory> PasswordResetOtpHistorys { get; set; }
        //public DbSet<EmpInfo> EmpInfos { get; set; }
        public DbSet<MailBodyConfiguration> MailBodyConfigurations { get; set; }

        public DbSet<ManagerUserMap> ManagerUserMaps { get; set; }
        public DbSet<NewsAndNotification> NewsAndNotifications { get; set; }

        public DbSet<MandateDocAsset> MandateDocAsset { get; set; }
        public DbSet<MandateDocByAssetsAssignment> MandateDocByAssetsAssignment { get; set; }
        public DbSet<AssetsAssignment> AssetsAssignment { get; set; }
        public DbSet<DocForAssetsHistoryAssignment> DocForAssetsHistoryAssignment { get; set; }
        public DbSet<assetsHistory> assetsHistory { get; set; }
        public DbSet<AssetMaster> AssetMaster { get; set; }
        public DbSet<Issues> Issues { get; set; }
        public DbSet<AttachmentMaster> AttachmentMaster { get; set; }
        public DbSet<AssetType> AssetType { get; set; }
        public DbSet<Models1> Models { get; set; }
        public DbSet<Processor> Processor { get; set; }
        public DbSet<Genration> Genration { get; set; }
        public DbSet<RAM> RAM { get; set; }
        public DbSet<HDD> HDD { get; set; }
        public DbSet<WarrantyStatus> WarrantyStatus { get; set; }
        public DbSet<OS> OS { get; set; }
        public DbSet<Charger> Charger { get; set; }
        public DbSet<ChargerType> ChargerType { get; set; }
        public DbSet<AccessoriesType> AccessoriesType { get; set; }
        public DbSet<TicketType> TicketType { get; set; }
        public DbSet<HardwareType> HardwareType { get; set; }
        public DbSet<SoftwareType> SoftwareType { get; set; }
        public DbSet<TicketType> TicketTypes { get; set; }
        public DbSet<HardwareType> HardwareTypes { get; set; }
        public DbSet<SoftwareType> SoftwareTypes { get; set; }
        public DbSet<Tickets> Tickets { get; set; }
        public DbSet<TicketAttachment> TicketAttachments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RoleAppMap>(
           build =>
           {
               build.HasKey(t => new { t.RoleID, t.AppID });
           });
            modelBuilder.Entity<UserRoleMap>(
            build =>
            {
                build.HasKey(t => new { t.UserID, t.RoleID });
            });
        }
    }
}
