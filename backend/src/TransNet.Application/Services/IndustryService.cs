using Microsoft.EntityFrameworkCore;
using TransNet.Application.Common;
using TransNet.Application.DTOs.Industries;
using TransNet.Application.Interfaces;
using TransNet.Domain.Entities;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public class IndustryService : IIndustryService
{
    private readonly IApplicationDbContext _context;

    public IndustryService(IApplicationDbContext context) => _context = context;

    public async Task<(List<IndustryDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 50, CancellationToken cancellationToken = default)
    {
        var query = QueryExtensions.ApplyPublicFilter(_context.Industries, adminView).OrderBy(i => i.SortOrder);
        var (items, meta) = await QueryExtensions.ToPagedListAsync(query, page, pageSize, cancellationToken);
        return (items.Select(Map).ToList(), meta);
    }

    public async Task<IndustryDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.Industries, adminView)
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<IndustryDto> CreateAsync(CreateIndustryDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new Industry
        {
            Name = dto.Name,
            Slug = dto.Slug ?? SlugHelper.Generate(dto.Name),
            ShortDescription = dto.ShortDescription,
            IconUrl = dto.IconUrl,
            SortOrder = dto.SortOrder,
            IsPublished = dto.IsPublished
        };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<IndustryDto?> UpdateAsync(Guid id, UpdateIndustryDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Industries.FirstOrDefaultAsync(i => i.Id == id && !i.IsDeleted, cancellationToken);
        if (entity is null) return null;

        entity.Name = dto.Name;
        entity.Slug = dto.Slug ?? SlugHelper.Generate(dto.Name);
        entity.ShortDescription = dto.ShortDescription;
        entity.IconUrl = dto.IconUrl;
        entity.SortOrder = dto.SortOrder;
        entity.IsPublished = dto.IsPublished;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Industries.FirstOrDefaultAsync(i => i.Id == id && !i.IsDeleted, cancellationToken);
        if (entity is null) return false;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static IndustryDto Map(Industry entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        Slug = entity.Slug,
        ShortDescription = entity.ShortDescription,
        IconUrl = entity.IconUrl,
        SortOrder = entity.SortOrder,
        IsPublished = entity.IsPublished,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
