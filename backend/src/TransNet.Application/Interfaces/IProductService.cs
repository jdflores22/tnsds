using TransNet.Application.Common;
using TransNet.Application.DTOs.Products;

namespace TransNet.Application.Interfaces;

public interface IProductService
{
    Task<(List<ProductDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 50, CancellationToken cancellationToken = default);
    Task<ProductDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default);
    Task<ProductDto> CreateAsync(CreateProductDto dto, CancellationToken cancellationToken = default);
    Task<ProductDto?> UpdateAsync(Guid id, UpdateProductDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
