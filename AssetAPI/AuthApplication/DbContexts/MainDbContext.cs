using AuthApplication.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetAuthApplication.DbContexts
{
    public class MainDbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public MainDbContext(DbContextOptions<MainDbContext> options, IConfiguration configuration) : base(options)
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                string mainDbConnectionString = _configuration.GetConnectionString("MainDatabaseCon");
                optionsBuilder.UseSqlServer(mainDbConnectionString);
            }
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("Users", "dbo");
        }

        public DbSet<User> Users { get; set; }
    }
}
