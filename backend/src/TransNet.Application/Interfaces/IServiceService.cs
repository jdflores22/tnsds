using TransNet.Application.Common;
using TransNet.Application.DTOs.Services;

namespace TransNet.Application.Interfaces;

public interface IServiceService
{
    Task<(List<ServiceDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default);
    Task<ServiceDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default);
    Task<ServiceDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<ServiceDto> CreateAsync(CreateServiceDto dto, CancellationToken cancellationToken = default);
    Task<ServiceDto?> UpdateAsync(Guid id, UpdateServiceDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
