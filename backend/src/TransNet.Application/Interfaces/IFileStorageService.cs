namespace TransNet.Application.Interfaces;

public record StoredMediaFile(
    string Url,
    string FileName,
    string Folder,
    long SizeBytes,
    DateTime CreatedAt);

public interface IFileStorageService
{
    Task<string> SaveFileAsync(Stream fileStream, string fileName, string folder = "uploads", CancellationToken cancellationToken = default);
    Task DeleteFileAsync(string filePath, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<StoredMediaFile>> ListFilesAsync(string? folder = null, CancellationToken cancellationToken = default);
}
