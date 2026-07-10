using TransNet.Application.Common;
using TransNet.Application.DTOs.Faq;

namespace TransNet.Application.Interfaces;

public interface IFaqService
{
    Task<(List<FaqItemDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 50, CancellationToken cancellationToken = default);
    Task<FaqItemDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default);
    Task<FaqItemDto> CreateAsync(CreateFaqItemDto dto, CancellationToken cancellationToken = default);
    Task<FaqItemDto?> UpdateAsync(Guid id, UpdateFaqItemDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
