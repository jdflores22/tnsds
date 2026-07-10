using Microsoft.EntityFrameworkCore;
using TransNet.Application.Common;
using TransNet.Application.DTOs.Products;
using TransNet.Application.Interfaces;
using TransNet.Domain.Entities;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public class ProductService : IProductService
{
    private readonly IApplicationDbContext _context;

    public ProductService(IApplicationDbContext context) => _context = context;

    public async Task<(List<ProductDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 50, CancellationToken cancellationToken = default)
    {
        var query = QueryExtensions.ApplyPublicFilter(_context.SoftwareProducts, adminView).OrderBy(p => p.SortOrder);
        var (items, meta) = await QueryExtensions.ToPagedListAsync(query, page, pageSize, cancellationToken);
        return (items.Select(Map).ToList(), meta);
    }

    public async Task<ProductDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.SoftwareProducts, adminView)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new SoftwareProduct
        {
            Name = dto.Name,
            Slug = dto.Slug ?? SlugHelper.Generate(dto.Name),
            ShortDescription = dto.ShortDescription,
            LogoUrl = dto.LogoUrl,
            SortOrder = dto.SortOrder,
            IsPublished = dto.IsPublished
        };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<ProductDto?> UpdateAsync(Guid id, UpdateProductDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.SoftwareProducts.FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, cancellationToken);
        if (entity is null) return null;

        entity.Name = dto.Name;
        entity.Slug = dto.Slug ?? SlugHelper.Generate(dto.Name);
        entity.ShortDescription = dto.ShortDescription;
        entity.LogoUrl = dto.LogoUrl;
        entity.SortOrder = dto.SortOrder;
        entity.IsPublished = dto.IsPublished;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.SoftwareProducts.FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, cancellationToken);
        if (entity is null) return false;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static ProductDto Map(SoftwareProduct entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        Slug = entity.Slug,
        ShortDescription = entity.ShortDescription,
        LogoUrl = entity.LogoUrl,
        SortOrder = entity.SortOrder,
        IsPublished = entity.IsPublished,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
