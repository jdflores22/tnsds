using TransNet.Application.Common;
using TransNet.Application.DTOs.Messages;

namespace TransNet.Application.Interfaces;

public interface IContactMessageService
{
    Task<(List<ContactMessageDto> Items, ResponseMeta Meta)> GetAllAsync(int page = 1, int pageSize = 20, CancellationToken cancellationToken = default);
    Task<ContactMessageDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ContactMessageDto> CreateAsync(CreateContactMessageDto dto, CancellationToken cancellationToken = default);
    Task<ContactMessageDto?> UpdateAsync(Guid id, UpdateContactMessageDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
