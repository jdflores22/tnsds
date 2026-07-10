using Microsoft.AspNetCore.Hosting;
using TransNet.Application.Interfaces;

namespace TransNet.Infrastructure.Services;

public class LocalFileStorageService : IFileStorageService
{
    private readonly string _uploadRoot;

    public LocalFileStorageService(IWebHostEnvironment environment)
    {
        _uploadRoot = Path.Combine(environment.WebRootPath ?? Path.Combine(environment.ContentRootPath, "wwwroot"), "uploads");
        Directory.CreateDirectory(_uploadRoot);
    }

    public async Task<string> SaveFileAsync(Stream fileStream, string fileName, string folder = "uploads", CancellationToken cancellationToken = default)
    {
        var safeName = $"{Guid.NewGuid():N}_{Path.GetFileName(fileName)}";
        var targetDir = folder == "uploads" ? _uploadRoot : Path.Combine(_uploadRoot, folder);
        Directory.CreateDirectory(targetDir);

        var fullPath = Path.Combine(targetDir, safeName);
        await using var file = File.Create(fullPath);
        await fileStream.CopyToAsync(file, cancellationToken);

        var relativePath = folder == "uploads" ? safeName : $"{folder}/{safeName}";
        return $"/uploads/{relativePath}".Replace("\\", "/");
    }

    public Task DeleteFileAsync(string filePath, CancellationToken cancellationToken = default)
    {
        var normalized = filePath.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString());
        var fullPath = Path.Combine(_uploadRoot, normalized.Replace("uploads" + Path.DirectorySeparatorChar, ""));
        if (File.Exists(fullPath))
            File.Delete(fullPath);

        return Task.CompletedTask;
    }
}
