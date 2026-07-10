using Microsoft.AspNetCore.Hosting;
using TransNet.Application.Interfaces;

namespace TransNet.Infrastructure.Services;

public class LocalFileStorageService : IFileStorageService
{
    private static readonly HashSet<string> ImageExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".tif", ".tiff",
    };

    private static readonly HashSet<string> ResumeExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".pdf", ".doc", ".docx",
    };

    private readonly string _uploadRoot;

    public LocalFileStorageService(IWebHostEnvironment environment)
    {
        _uploadRoot = Path.Combine(environment.WebRootPath ?? Path.Combine(environment.ContentRootPath, "wwwroot"), "uploads");
        Directory.CreateDirectory(_uploadRoot);
    }

    public async Task<string> SaveFileAsync(Stream fileStream, string fileName, string folder = "uploads", CancellationToken cancellationToken = default)
    {
        var ext = Path.GetExtension(fileName);
        var allowed = folder == "resumes" ? ResumeExtensions : ImageExtensions;
        if (!allowed.Contains(ext))
            throw new InvalidOperationException($"File type '{ext}' is not allowed for folder '{folder}'.");

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

    public Task<IReadOnlyList<StoredMediaFile>> ListFilesAsync(string? folder = null, CancellationToken cancellationToken = default)
    {
        var results = new List<StoredMediaFile>();
        var searchRoot = string.IsNullOrWhiteSpace(folder) || folder == "all"
            ? _uploadRoot
            : Path.Combine(_uploadRoot, folder);

        if (!Directory.Exists(searchRoot))
            return Task.FromResult<IReadOnlyList<StoredMediaFile>>(results);

        foreach (var file in Directory.EnumerateFiles(searchRoot, "*", SearchOption.AllDirectories))
        {
            var ext = Path.GetExtension(file);
            if (!ImageExtensions.Contains(ext))
                continue;

            var relative = Path.GetRelativePath(_uploadRoot, file).Replace("\\", "/");
            var info = new FileInfo(file);
            var folderName = relative.Contains('/')
                ? relative[..relative.LastIndexOf('/')]
                : string.Empty;

            results.Add(new StoredMediaFile(
                Url: $"/uploads/{relative}",
                FileName: info.Name,
                Folder: folderName,
                SizeBytes: info.Length,
                CreatedAt: info.CreationTimeUtc));
        }

        results.Sort((a, b) => b.CreatedAt.CompareTo(a.CreatedAt));
        return Task.FromResult<IReadOnlyList<StoredMediaFile>>(results);
    }
}
