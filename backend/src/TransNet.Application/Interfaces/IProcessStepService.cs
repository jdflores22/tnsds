using TransNet.Application.Common;
using TransNet.Application.DTOs.ProcessSteps;

namespace TransNet.Application.Interfaces;

public interface IProcessStepService
{
    Task<(List<ProcessStepDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 50, CancellationToken cancellationToken = default);
    Task<ProcessStepDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default);
    Task<ProcessStepDto> CreateAsync(CreateProcessStepDto dto, CancellationToken cancellationToken = default);
    Task<ProcessStepDto?> UpdateAsync(Guid id, UpdateProcessStepDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
