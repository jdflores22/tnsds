using TransNet.Application.Common;
using TransNet.Application.DTOs.Industries;

namespace TransNet.Application.Interfaces;

public interface IIndustryService
{
    Task<(List<IndustryDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 50, CancellationToken cancellationToken = default);
    Task<IndustryDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default);
    Task<IndustryDto> CreateAsync(CreateIndustryDto dto, CancellationToken cancellationToken = default);
    Task<IndustryDto?> UpdateAsync(Guid id, UpdateIndustryDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
