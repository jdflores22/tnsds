using TransNet.Application.Common;
using TransNet.Application.DTOs.Blogs;

namespace TransNet.Application.Interfaces;

public interface IBlogService
{
    Task<(List<BlogDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default);
    Task<BlogDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default);
    Task<BlogDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<BlogDto> CreateAsync(CreateBlogDto dto, Guid? authorId, CancellationToken cancellationToken = default);
    Task<BlogDto?> UpdateAsync(Guid id, UpdateBlogDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

public interface IBlogCategoryService
{
    Task<(List<BlogCategoryDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default);
    Task<BlogCategoryDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default);
    Task<BlogCategoryDto> CreateAsync(CreateBlogCategoryDto dto, CancellationToken cancellationToken = default);
    Task<BlogCategoryDto?> UpdateAsync(Guid id, UpdateBlogCategoryDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
