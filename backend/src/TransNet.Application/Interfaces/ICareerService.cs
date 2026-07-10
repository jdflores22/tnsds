using TransNet.Application.Common;
using TransNet.Application.DTOs.Careers;

namespace TransNet.Application.Interfaces;

public interface ICareerService
{
    Task<(List<CareerDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default);
    Task<CareerDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default);
    Task<CareerDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<CareerDto> CreateAsync(CreateCareerDto dto, CancellationToken cancellationToken = default);
    Task<CareerDto?> UpdateAsync(Guid id, UpdateCareerDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

public interface IJobApplicationService
{
    Task<(List<JobApplicationDto> Items, ResponseMeta Meta)> GetAllAsync(int page = 1, int pageSize = 20, CancellationToken cancellationToken = default);
    Task<JobApplicationDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<JobApplicationDto> CreateAsync(CreateJobApplicationDto dto, CancellationToken cancellationToken = default);
    Task<JobApplicationDto?> UpdateAsync(Guid id, UpdateJobApplicationDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
