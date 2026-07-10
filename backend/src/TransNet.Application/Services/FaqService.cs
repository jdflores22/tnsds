using Microsoft.EntityFrameworkCore;
using TransNet.Application.Common;
using TransNet.Application.DTOs.Faq;
using TransNet.Application.Interfaces;
using TransNet.Domain.Entities;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public class FaqService : IFaqService
{
    private readonly IApplicationDbContext _context;

    public FaqService(IApplicationDbContext context) => _context = context;

    public async Task<(List<FaqItemDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 50, CancellationToken cancellationToken = default)
    {
        var query = QueryExtensions.ApplyPublicFilter(_context.FaqItems, adminView).OrderBy(f => f.SortOrder);
        var (items, meta) = await QueryExtensions.ToPagedListAsync(query, page, pageSize, cancellationToken);
        return (items.Select(Map).ToList(), meta);
    }

    public async Task<FaqItemDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.FaqItems, adminView)
            .FirstOrDefaultAsync(f => f.Id == id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<FaqItemDto> CreateAsync(CreateFaqItemDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new FaqItem
        {
            Question = dto.Question,
            Answer = dto.Answer,
            SortOrder = dto.SortOrder,
            IsPublished = dto.IsPublished
        };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<FaqItemDto?> UpdateAsync(Guid id, UpdateFaqItemDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.FaqItems.FirstOrDefaultAsync(f => f.Id == id && !f.IsDeleted, cancellationToken);
        if (entity is null) return null;

        entity.Question = dto.Question;
        entity.Answer = dto.Answer;
        entity.SortOrder = dto.SortOrder;
        entity.IsPublished = dto.IsPublished;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.FaqItems.FirstOrDefaultAsync(f => f.Id == id && !f.IsDeleted, cancellationToken);
        if (entity is null) return false;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static FaqItemDto Map(FaqItem entity) => new()
    {
        Id = entity.Id,
        Question = entity.Question,
        Answer = entity.Answer,
        SortOrder = entity.SortOrder,
        IsPublished = entity.IsPublished,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
