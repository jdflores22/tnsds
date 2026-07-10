using TransNet.Application.Common;
using TransNet.Application.DTOs.Portfolio;

namespace TransNet.Application.Interfaces;

public interface IPortfolioService
{
    Task<(List<PortfolioDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default);
    Task<PortfolioDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default);
    Task<PortfolioDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<PortfolioDto> CreateAsync(CreatePortfolioDto dto, CancellationToken cancellationToken = default);
    Task<PortfolioDto?> UpdateAsync(Guid id, UpdatePortfolioDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
