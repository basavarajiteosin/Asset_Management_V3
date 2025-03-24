using System.Text;
using AssetAuthApplication.DbContexts;
using AssetManagement.Services;
using AssetManagementAPI.Services;
using AuthApplication.DbContexts;
using AuthApplication.Services;
using GlobalTrackersAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using PMOAPIV2.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
var provider = builder.Services.BuildServiceProvider();
var configuration = provider.GetRequiredService<IConfiguration>();

builder.Services.AddDbContext<AuthAppContext>(item => item.UseSqlServer(configuration.GetConnectionString("myconn")));
builder.Services.AddDbContext<MainDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("MainDatabaseCon")));


builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<AuthMasterServices>();
builder.Services.AddScoped<EmailConfigurationService>();
builder.Services.AddScoped<GraphEmailService>();
builder.Services.AddControllersWithViews();
builder.Services.AddScoped<IAssetService, AssetService>();
builder.Services.AddScoped<IDeviceAssetService, DeviceAssetService>();
builder.Services.AddScoped<IAssetTypeService, AssetTypeService>();
builder.Services.AddScoped<IModelService, ModelService>();
builder.Services.AddScoped<IProcessorService, ProcessorService>();
builder.Services.AddScoped<IGenrationService, GenrationService>();
builder.Services.AddScoped<IRAMService, RAMService>();
builder.Services.AddScoped<IHDDService, HDDService>();
builder.Services.AddScoped<IWarrantyStatusService, WarrantyStatusService>();
builder.Services.AddScoped<IOSService, OSService>();
builder.Services.AddScoped<IChargerService, ChargerService>();
builder.Services.AddScoped<IChargerTypeService, ChargerTypeService>();
builder.Services.AddScoped<IAccessoriesTypeService, AccessoriesTypeService>();
builder.Services.AddScoped<ITicketMasterService, TicketMasterService>();
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddHttpClient();
// Add your other services here
builder.Services.AddScoped<SMSService>();

var key = Encoding.ASCII.GetBytes(configuration["Jwt:Key"]);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers().AddNewtonsoftJson();


var app = builder.Build();

//if (app.Environment.IsDevelopment())
//{

//}

if (!app.Environment.IsDevelopment())
{
    app.UseStaticFiles();// For the wwwroot folder

    app.UseStaticFiles(new StaticFileOptions

    {

        FileProvider = new PhysicalFileProvider(

                Path.Combine(Directory.GetCurrentDirectory(), "ProfileAttachemants")),

        RequestPath = "/ProfileAttachemants"

    });
    app.UseRouting();
}

app.UseSwagger();
app.UseSwaggerUI();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();

