using Microsoft.EntityFrameworkCore;
using TransNet.Application.Common;
using TransNet.Application.DTOs.SiteStats;
using TransNet.Application.Interfaces;
using TransNet.Domain.Entities;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public class SiteStatService : ISiteStatService
{
    private readonly IApplicationDbContext _context;

    public SiteStatService(IApplicationDbContext context) => _context = context;

    public async Task<(List<SiteStatDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 50, CancellationToken cancellationToken = default)
    {
        var query = QueryExtensions.ApplyPublicFilter(_context.SiteStats, adminView).OrderBy(s => s.SortOrder);
        var (items, meta) = await QueryExtensions.ToPagedListAsync(query, page, pageSize, cancellationToken);
        return (items.Select(Map).ToList(), meta);
    }

    public async Task<SiteStatDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.SiteStats, adminView)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<SiteStatDto> CreateAsync(CreateSiteStatDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new SiteStat
        {
            Value = dto.Value,
            Label = dto.Label,
            Icon = dto.Icon,
            SortOrder = dto.SortOrder,
            IsPublished = dto.IsPublished
        };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<SiteStatDto?> UpdateAsync(Guid id, UpdateSiteStatDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.SiteStats.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted, cancellationToken);
        if (entity is null) return null;

        entity.Value = dto.Value;
        entity.Label = dto.Label;
        entity.Icon = dto.Icon;
        entity.SortOrder = dto.SortOrder;
        entity.IsPublished = dto.IsPublished;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.SiteStats.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted, cancellationToken);
        if (entity is null) return false;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static SiteStatDto Map(SiteStat entity) => new()
    {
        Id = entity.Id,
        Value = entity.Value,
        Label = entity.Label,
        Icon = entity.Icon,
        SortOrder = entity.SortOrder,
        IsPublished = entity.IsPublished,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
