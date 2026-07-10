using TransNet.Application.Common;
using TransNet.Application.DTOs.Testimonials;

namespace TransNet.Application.Interfaces;

public interface ITestimonialService
{
    Task<(List<TestimonialDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default);
    Task<TestimonialDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default);
    Task<TestimonialDto> CreateAsync(CreateTestimonialDto dto, CancellationToken cancellationToken = default);
    Task<TestimonialDto?> UpdateAsync(Guid id, UpdateTestimonialDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
