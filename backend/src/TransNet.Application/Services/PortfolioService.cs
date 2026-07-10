using Microsoft.EntityFrameworkCore;
using TransNet.Application.Common;
using TransNet.Application.DTOs.Portfolio;
using TransNet.Application.Interfaces;
using TransNet.Domain.Entities;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public class PortfolioService : IPortfolioService
{
    private readonly IApplicationDbContext _context;

    public PortfolioService(IApplicationDbContext context) => _context = context;

    public async Task<(List<PortfolioDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = QueryExtensions.ApplyPublicFilter(_context.Portfolios, adminView)
            .Include(p => p.Client)
            .OrderBy(p => p.SortOrder);
        var (items, meta) = await QueryExtensions.ToPagedListAsync(query, page, pageSize, cancellationToken);
        return (items.Select(Map).ToList(), meta);
    }

    public async Task<PortfolioDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.Portfolios, adminView)
            .Include(p => p.Client)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<PortfolioDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.Portfolios, false)
            .Include(p => p.Client)
            .FirstOrDefaultAsync(p => p.Slug == slug, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<PortfolioDto> CreateAsync(CreatePortfolioDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new Portfolio
        {
            Title = dto.Title,
            Slug = dto.Slug ?? SlugHelper.Generate(dto.Title),
            Description = dto.Description,
            Content = dto.Content,
            ClientId = dto.ClientId,
            LogoUrl = dto.LogoUrl,
            ImagesJson = dto.ImagesJson,
            TechStackJson = dto.TechStackJson,
            IsFeatured = dto.IsFeatured,
            SortOrder = dto.SortOrder,
            IsPublished = dto.IsPublished
        };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<PortfolioDto?> UpdateAsync(Guid id, UpdatePortfolioDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Portfolios.Include(p => p.Client)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, cancellationToken);
        if (entity is null) return null;

        entity.Title = dto.Title;
        entity.Slug = dto.Slug ?? SlugHelper.Generate(dto.Title);
        entity.Description = dto.Description;
        entity.Content = dto.Content;
        entity.ClientId = dto.ClientId;
        entity.LogoUrl = dto.LogoUrl;
        entity.ImagesJson = dto.ImagesJson;
        entity.TechStackJson = dto.TechStackJson;
        entity.IsFeatured = dto.IsFeatured;
        entity.SortOrder = dto.SortOrder;
        entity.IsPublished = dto.IsPublished;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Portfolios.FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, cancellationToken);
        if (entity is null) return false;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static PortfolioDto Map(Portfolio entity) => new()
    {
        Id = entity.Id,
        Title = entity.Title,
        Slug = entity.Slug,
        Description = entity.Description,
        Content = entity.Content,
        ClientId = entity.ClientId,
        ClientName = entity.Client?.Name,
        LogoUrl = entity.LogoUrl,
        ImagesJson = entity.ImagesJson,
        TechStackJson = entity.TechStackJson,
        IsFeatured = entity.IsFeatured,
        SortOrder = entity.SortOrder,
        IsPublished = entity.IsPublished,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
