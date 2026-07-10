using TransNet.Application.Common;
using TransNet.Application.DTOs.CompanyHighlights;

namespace TransNet.Application.Interfaces;

public interface ICompanyHighlightService
{
    Task<(List<CompanyHighlightDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 50, CancellationToken cancellationToken = default);
    Task<CompanyHighlightDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default);
    Task<CompanyHighlightDto> CreateAsync(CreateCompanyHighlightDto dto, CancellationToken cancellationToken = default);
    Task<CompanyHighlightDto?> UpdateAsync(Guid id, UpdateCompanyHighlightDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
