using TransNet.Application.Common;
using TransNet.Application.DTOs.SiteStats;

namespace TransNet.Application.Interfaces;

public interface ISiteStatService
{
    Task<(List<SiteStatDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 50, CancellationToken cancellationToken = default);
    Task<SiteStatDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default);
    Task<SiteStatDto> CreateAsync(CreateSiteStatDto dto, CancellationToken cancellationToken = default);
    Task<SiteStatDto?> UpdateAsync(Guid id, UpdateSiteStatDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
