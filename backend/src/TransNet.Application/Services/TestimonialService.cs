using Microsoft.EntityFrameworkCore;
using TransNet.Application.Common;
using TransNet.Application.DTOs.Testimonials;
using TransNet.Application.Interfaces;
using TransNet.Domain.Entities;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public class TestimonialService : ITestimonialService
{
    private readonly IApplicationDbContext _context;

    public TestimonialService(IApplicationDbContext context) => _context = context;

    public async Task<(List<TestimonialDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = QueryExtensions.ApplyPublicFilter(_context.Testimonials, adminView).OrderBy(t => t.SortOrder);
        var (items, meta) = await QueryExtensions.ToPagedListAsync(query, page, pageSize, cancellationToken);
        return (items.Select(Map).ToList(), meta);
    }

    public async Task<TestimonialDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.Testimonials, adminView)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<TestimonialDto> CreateAsync(CreateTestimonialDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new Testimonial
        {
            Name = dto.Name,
            Company = dto.Company,
            Quote = dto.Quote,
            AvatarUrl = dto.AvatarUrl,
            SortOrder = dto.SortOrder,
            Rating = dto.Rating,
            IsPublished = dto.IsPublished
        };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<TestimonialDto?> UpdateAsync(Guid id, UpdateTestimonialDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Testimonials.FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted, cancellationToken);
        if (entity is null) return null;

        entity.Name = dto.Name;
        entity.Company = dto.Company;
        entity.Quote = dto.Quote;
        entity.AvatarUrl = dto.AvatarUrl;
        entity.SortOrder = dto.SortOrder;
        entity.Rating = dto.Rating;
        entity.IsPublished = dto.IsPublished;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Testimonials.FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted, cancellationToken);
        if (entity is null) return false;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static TestimonialDto Map(Testimonial entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        Company = entity.Company,
        Quote = entity.Quote,
        AvatarUrl = entity.AvatarUrl,
        SortOrder = entity.SortOrder,
        Rating = entity.Rating,
        IsPublished = entity.IsPublished,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
