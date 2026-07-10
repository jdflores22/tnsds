using TransNet.Application.Common;
using TransNet.Application.DTOs.Subscribers;

namespace TransNet.Application.Interfaces;

public interface ISubscriberService
{
    Task<(List<SubscriberDto> Items, ResponseMeta Meta)> GetAllAsync(int page = 1, int pageSize = 20, CancellationToken cancellationToken = default);
    Task<SubscriberDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<SubscriberDto> SubscribeAsync(CreateSubscriberDto dto, CancellationToken cancellationToken = default);
    Task<bool> UnsubscribeAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
