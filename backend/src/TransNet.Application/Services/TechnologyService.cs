using Microsoft.EntityFrameworkCore;
using TransNet.Application.Common;
using TransNet.Application.DTOs.Technologies;
using TransNet.Application.Interfaces;
using TransNet.Domain.Entities;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public class TechnologyService : ITechnologyService
{
    private readonly IApplicationDbContext _context;

    public TechnologyService(IApplicationDbContext context) => _context = context;

    public async Task<(List<TechnologyDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = QueryExtensions.ApplyPublicFilter(_context.Technologies, adminView).OrderBy(t => t.SortOrder);
        var (items, meta) = await QueryExtensions.ToPagedListAsync(query, page, pageSize, cancellationToken);
        return (items.Select(Map).ToList(), meta);
    }

    public async Task<TechnologyDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.Technologies, adminView)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<TechnologyDto> CreateAsync(CreateTechnologyDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new Technology
        {
            Name = dto.Name,
            Category = dto.Category,
            IconUrl = dto.IconUrl,
            SortOrder = dto.SortOrder,
            IsPublished = dto.IsPublished
        };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<TechnologyDto?> UpdateAsync(Guid id, UpdateTechnologyDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Technologies.FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted, cancellationToken);
        if (entity is null) return null;

        entity.Name = dto.Name;
        entity.Category = dto.Category;
        entity.IconUrl = dto.IconUrl;
        entity.SortOrder = dto.SortOrder;
        entity.IsPublished = dto.IsPublished;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Technologies.FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted, cancellationToken);
        if (entity is null) return false;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static TechnologyDto Map(Technology entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        Category = entity.Category,
        IconUrl = entity.IconUrl,
        SortOrder = entity.SortOrder,
        IsPublished = entity.IsPublished,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
