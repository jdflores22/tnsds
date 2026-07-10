using Microsoft.EntityFrameworkCore;
using TransNet.Application.Common;
using TransNet.Application.DTOs.Services;
using TransNet.Application.Interfaces;
using TransNet.Domain.Entities;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public class ServiceService : IServiceService
{
    private readonly IApplicationDbContext _context;

    public ServiceService(IApplicationDbContext context) => _context = context;

    public async Task<(List<ServiceDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = QueryExtensions.ApplyPublicFilter(_context.Services, adminView).OrderBy(s => s.SortOrder);
        var (items, meta) = await QueryExtensions.ToPagedListAsync(query, page, pageSize, cancellationToken);
        return (items.Select(Map).ToList(), meta);
    }

    public async Task<ServiceDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.Services, adminView)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<ServiceDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.Services, false)
            .FirstOrDefaultAsync(s => s.Slug == slug, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<ServiceDto> CreateAsync(CreateServiceDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new Service
        {
            Title = dto.Title,
            Slug = dto.Slug ?? SlugHelper.Generate(dto.Title),
            ShortDescription = dto.ShortDescription,
            Description = dto.Description,
            Icon = dto.Icon,
            SortOrder = dto.SortOrder,
            IsPublished = dto.IsPublished
        };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<ServiceDto?> UpdateAsync(Guid id, UpdateServiceDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Services.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted, cancellationToken);
        if (entity is null) return null;

        entity.Title = dto.Title;
        entity.Slug = dto.Slug ?? SlugHelper.Generate(dto.Title);
        entity.ShortDescription = dto.ShortDescription;
        entity.Description = dto.Description;
        entity.Icon = dto.Icon;
        entity.SortOrder = dto.SortOrder;
        entity.IsPublished = dto.IsPublished;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Services.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted, cancellationToken);
        if (entity is null) return false;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static ServiceDto Map(Service entity) => new()
    {
        Id = entity.Id,
        Title = entity.Title,
        Slug = entity.Slug,
        ShortDescription = entity.ShortDescription,
        Description = entity.Description,
        Icon = entity.Icon,
        SortOrder = entity.SortOrder,
        IsPublished = entity.IsPublished,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
