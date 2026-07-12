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

    public async Task<ProductDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.SoftwareProducts, adminView: false)
            .FirstOrDefaultAsync(p => p.Slug == slug, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto, CancellationToken cancellationToken = default)
    {
        if (dto.IsFeatured)
            await ClearFeaturedExceptAsync(null, cancellationToken);

        var entity = new SoftwareProduct
        {
            Name = dto.Name,
            Slug = dto.Slug ?? SlugHelper.Generate(dto.Name),
            ShortDescription = dto.ShortDescription,
            Description = dto.Description,
            FeaturesJson = string.IsNullOrWhiteSpace(dto.FeaturesJson) ? "[]" : dto.FeaturesJson,
            ScreenshotsJson = string.IsNullOrWhiteSpace(dto.ScreenshotsJson) ? "[]" : dto.ScreenshotsJson,
            LogoUrl = dto.LogoUrl,
            SortOrder = dto.SortOrder,
            IsPublished = dto.IsPublished,
            IsFeatured = dto.IsFeatured,
            HomepageRow = NormalizeHomepageRow(dto.HomepageRow),
        };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<ProductDto?> UpdateAsync(Guid id, UpdateProductDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.SoftwareProducts.FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, cancellationToken);
        if (entity is null) return null;

        if (dto.IsFeatured)
            await ClearFeaturedExceptAsync(id, cancellationToken);

        entity.Name = dto.Name;
        entity.Slug = dto.Slug ?? SlugHelper.Generate(dto.Name);
        entity.ShortDescription = dto.ShortDescription;
        entity.Description = dto.Description;
        entity.FeaturesJson = string.IsNullOrWhiteSpace(dto.FeaturesJson) ? "[]" : dto.FeaturesJson;
        entity.ScreenshotsJson = string.IsNullOrWhiteSpace(dto.ScreenshotsJson) ? "[]" : dto.ScreenshotsJson;
        entity.LogoUrl = dto.LogoUrl;
        entity.SortOrder = dto.SortOrder;
        entity.IsPublished = dto.IsPublished;
        entity.IsFeatured = dto.IsFeatured;
        entity.HomepageRow = NormalizeHomepageRow(dto.HomepageRow);
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

    private async Task ClearFeaturedExceptAsync(Guid? keepId, CancellationToken cancellationToken)
    {
        var others = await _context.SoftwareProducts
            .Where(p => !p.IsDeleted && p.IsFeatured && (keepId == null || p.Id != keepId))
            .ToListAsync(cancellationToken);

        foreach (var product in others)
        {
            product.IsFeatured = false;
            product.UpdatedAt = DateTime.UtcNow;
        }
    }

    private static int NormalizeHomepageRow(int row) => row <= 1 ? 1 : 2;

    private static ProductDto Map(SoftwareProduct entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        Slug = entity.Slug,
        ShortDescription = entity.ShortDescription,
        Description = entity.Description,
        FeaturesJson = entity.FeaturesJson,
        ScreenshotsJson = entity.ScreenshotsJson,
        LogoUrl = entity.LogoUrl,
        SortOrder = entity.SortOrder,
        IsPublished = entity.IsPublished,
        IsFeatured = entity.IsFeatured,
        HomepageRow = entity.HomepageRow,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
