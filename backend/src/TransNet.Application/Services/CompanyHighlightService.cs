using Microsoft.EntityFrameworkCore;
using TransNet.Application.Common;
using TransNet.Application.DTOs.CompanyHighlights;
using TransNet.Application.Interfaces;
using TransNet.Domain.Entities;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public class CompanyHighlightService : ICompanyHighlightService
{
    private readonly IApplicationDbContext _context;

    public CompanyHighlightService(IApplicationDbContext context) => _context = context;

    public async Task<(List<CompanyHighlightDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 50, CancellationToken cancellationToken = default)
    {
        var query = QueryExtensions.ApplyPublicFilter(_context.CompanyHighlights, adminView).OrderBy(h => h.SortOrder);
        var (items, meta) = await QueryExtensions.ToPagedListAsync(query, page, pageSize, cancellationToken);
        return (items.Select(Map).ToList(), meta);
    }

    public async Task<CompanyHighlightDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.CompanyHighlights, adminView)
            .FirstOrDefaultAsync(h => h.Id == id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<CompanyHighlightDto> CreateAsync(CreateCompanyHighlightDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new CompanyHighlight
        {
            Title = dto.Title,
            Description = dto.Description,
            SortOrder = dto.SortOrder,
            IsPublished = dto.IsPublished,
            HomepageRow = NormalizeHomepageRow(dto.HomepageRow),
        };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<CompanyHighlightDto?> UpdateAsync(Guid id, UpdateCompanyHighlightDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.CompanyHighlights.FirstOrDefaultAsync(h => h.Id == id && !h.IsDeleted, cancellationToken);
        if (entity is null) return null;

        entity.Title = dto.Title;
        entity.Description = dto.Description;
        entity.SortOrder = dto.SortOrder;
        entity.IsPublished = dto.IsPublished;
        entity.HomepageRow = NormalizeHomepageRow(dto.HomepageRow);
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.CompanyHighlights.FirstOrDefaultAsync(h => h.Id == id && !h.IsDeleted, cancellationToken);
        if (entity is null) return false;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static int NormalizeHomepageRow(int row) => row <= 1 ? 1 : 2;

    private static CompanyHighlightDto Map(CompanyHighlight entity) => new()
    {
        Id = entity.Id,
        Title = entity.Title,
        Description = entity.Description,
        SortOrder = entity.SortOrder,
        IsPublished = entity.IsPublished,
        HomepageRow = entity.HomepageRow,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
