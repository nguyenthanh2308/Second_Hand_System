using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Second_hand_System.Data;
using Second_hand_System.Repositories;
using Second_hand_System.Services;

var builder = WebApplication.CreateBuilder(args);

// ========================================
// SECURITY: Validate Critical Configuration
// ========================================

// Validate Database Connection String
// Priority: Environment variable (for Render) > appsettings.json (for local)
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") 
                       ?? builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrEmpty(connectionString) || 
    connectionString.Contains("YOUR_SERVER") || 
    connectionString.Contains("YOUR_DATABASE") ||
    connectionString.Contains("YOUR_PASSWORD") ||
    connectionString.Contains("${DATABASE_URL}"))
{
    throw new InvalidOperationException(
        "Database connection string not properly configured. " +
        "Please set DATABASE_URL environment variable or update appsettings.json with your database credentials.");
}

// Validate JWT Secret Key (with Environment Variable fallback)
var jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") 
             ?? builder.Configuration["Jwt:Key"];

if (string.IsNullOrEmpty(jwtKey) || 
    jwtKey.Contains("YOUR_SECRET_KEY") ||
    jwtKey.Length < 32)
{
    throw new InvalidOperationException(
        "JWT Secret Key not properly configured or too short (minimum 32 characters required). " +
        "Options:\n" +
        "  1. Set environment variable: JWT_SECRET_KEY=your-secret-here\n" +
        "  2. Update appsettings.json with a secure key (minimum 32 characters)\n" +
        "Please copy appsettings.Example.json to appsettings.json and configure properly.");
}

// Add services to the container.
// Support PostgreSQL (production) and MySQL (development)
var isDevelopment = builder.Environment.IsDevelopment();
if (isDevelopment)
{
    // Development: MySQL
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
}
else
{
    // Production: PostgreSQL (for Render deployment)
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(connectionString));
}

// Dependency Injection - Repositories
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// Dependency Injection - Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IFileStorageService, FileStorageService>();

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularApp", policy =>
    {
        var allowedOrigins = new List<string> { "http://localhost:4200" };
        
        // Add production URL if configured
        var productionUrl = builder.Configuration["ProductionFrontendUrl"];
        if (!string.IsNullOrEmpty(productionUrl))
        {
            allowedOrigins.Add(productionUrl);
        }
        
        policy.WithOrigins(allowedOrigins.ToArray())
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            RoleClaimType = System.Security.Claims.ClaimTypes.Role
        };
        
        // Add event handlers for debugging
        options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                var claims = context.Principal?.Claims;
                Console.WriteLine("=== JWT Token Validated ===");
                if (claims != null)
                {
                    foreach (var claim in claims)
                    {
                        Console.WriteLine($"  Claim: {claim.Type} = {claim.Value}");
                    }
                }
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"=== JWT Authentication FAILED ===");
                Console.WriteLine($"  Error: {context.Exception.Message}");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddControllers()
    .AddJsonOptions(x =>
    {
        x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Second-hand System API", Version = "v1" });
    
    // Config Swagger to use JWT
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Seed Data (only in Development)
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<AppDbContext>();
            DbInitializer.Seed(context);
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred while seeding the database.");
        }
    }
}

app.UseHttpsRedirection();

// Custom Exception Middleware
app.UseMiddleware<Second_hand_System.Middleware.ExceptionMiddleware>();

// Static Files (for images)
app.UseStaticFiles();

// CORS
app.UseCors("AngularApp");

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
