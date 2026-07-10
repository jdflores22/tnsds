using TransNet.Application.Common;
using TransNet.Application.DTOs.Projects;

namespace TransNet.Application.Interfaces;

public interface IProjectService
{
    Task<(List<ProjectDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default);
    Task<ProjectDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default);
    Task<ProjectDto> CreateAsync(CreateProjectDto dto, CancellationToken cancellationToken = default);
    Task<ProjectDto?> UpdateAsync(Guid id, UpdateProjectDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
