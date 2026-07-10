using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;
using TransNet.API.Middleware;
using TransNet.Infrastructure;
using TransNet.Persistence;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console());

    builder.Services.AddInfrastructure(builder.Configuration);

    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo { Title = "TRANS-NET API", Version = "v1" });
        options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "JWT Authorization header using the Bearer scheme.",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT"
        });
        options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                },
                Array.Empty<string>()
            }
        });
    });

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("Default", policy =>
        {
            if (builder.Environment.IsDevelopment())
            {
                policy.SetIsOriginAllowed(origin =>
                {
                    if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri))
                        return false;
                    return uri.Host is "localhost" or "127.0.0.1";
                })
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
            }
            else
            {
                var origins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>()
                    ?? new[] { "http://localhost:5173" };
                policy.WithOrigins(origins)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            }
        });
    });

    builder.Services.AddHealthChecks()
        .AddDbContextCheck<ApplicationDbContext>();

    builder.Services.AddRateLimiter(options =>
    {
        options.AddFixedWindowLimiter("fixed", limiterOptions =>
        {
            limiterOptions.PermitLimit = 100;
            limiterOptions.Window = TimeSpan.FromMinutes(1);
            limiterOptions.QueueLimit = 0;
        });
        options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    });

    builder.Services.AddScoped<DatabaseSeeder>();

    var app = builder.Build();

    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await db.Database.MigrateAsync();
        var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
        await seeder.SeedAsync();
    }

    // Restore bundled seed images into the (possibly volume-backed, ephemeral) uploads
    // directory so deploys such as Railway show the same images as local. Existing files
    // are never overwritten, so user uploads on a persistent volume are preserved.
    try
    {
        var seedDir = Path.Combine(app.Environment.ContentRootPath, "seed-uploads");
        var webRoot = app.Environment.WebRootPath
            ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");
        var uploadsDir = Path.Combine(webRoot, "uploads");

        if (Directory.Exists(seedDir))
        {
            var restored = 0;
            foreach (var source in Directory.EnumerateFiles(seedDir, "*", SearchOption.AllDirectories))
            {
                var relative = Path.GetRelativePath(seedDir, source);
                var destination = Path.Combine(uploadsDir, relative);
                if (File.Exists(destination))
                    continue;

                Directory.CreateDirectory(Path.GetDirectoryName(destination)!);
                File.Copy(source, destination);
                restored++;
            }

            if (restored > 0)
                Log.Information("Restored {Count} seed image(s) into {UploadsDir}", restored, uploadsDir);
        }
    }
    catch (Exception ex)
    {
        Log.Warning(ex, "Failed to restore seed images into uploads directory");
    }

    app.UseSerilogRequestLogging();
    app.UseMiddleware<ExceptionMiddleware>();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseCors("Default");
    app.UseRateLimiter();
    app.UseStaticFiles();
    app.UseAuthentication();
    app.UseAuthorization();
    app.UseMiddleware<ActivityLogMiddleware>();

    app.MapControllers().RequireRateLimiting("fixed");
    app.MapHealthChecks("/health");

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
