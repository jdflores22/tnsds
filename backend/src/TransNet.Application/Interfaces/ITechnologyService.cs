using TransNet.Application.Common;
using TransNet.Application.DTOs.Technologies;

namespace TransNet.Application.Interfaces;

public interface ITechnologyService
{
    Task<(List<TechnologyDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default);
    Task<TechnologyDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default);
    Task<TechnologyDto> CreateAsync(CreateTechnologyDto dto, CancellationToken cancellationToken = default);
    Task<TechnologyDto?> UpdateAsync(Guid id, UpdateTechnologyDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
