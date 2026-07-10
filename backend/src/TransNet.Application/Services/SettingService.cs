using Microsoft.EntityFrameworkCore;
using TransNet.Application.DTOs.Settings;
using TransNet.Application.Interfaces;
using TransNet.Domain.Entities;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public class SiteSettingService : ISiteSettingService
{
    private readonly IApplicationDbContext _context;

    public SiteSettingService(IApplicationDbContext context) => _context = context;

    public async Task<List<SiteSettingDto>> GetAllAsync(bool adminView, CancellationToken cancellationToken = default)
    {
        var query = _context.SiteSettings.AsQueryable();
        if (!adminView)
            query = query.Where(s => s.IsPublic);

        return await query.OrderBy(s => s.Group).ThenBy(s => s.Key)
            .Select(s => Map(s))
            .ToListAsync(cancellationToken);
    }

    public async Task<SiteSettingDto?> GetByKeyAsync(string key, bool adminView, CancellationToken cancellationToken = default)
    {
        var query = _context.SiteSettings.Where(s => s.Key == key);
        if (!adminView)
            query = query.Where(s => s.IsPublic);

        var entity = await query.FirstOrDefaultAsync(cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<SiteSettingDto> CreateAsync(CreateSiteSettingDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new SiteSetting
        {
            Key = dto.Key,
            Value = dto.Value,
            Group = dto.Group,
            IsPublic = dto.IsPublic
        };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<SiteSettingDto?> UpdateAsync(Guid id, UpdateSiteSettingDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.SiteSettings.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (entity is null) return null;

        entity.Value = dto.Value;
        entity.Group = dto.Group;
        entity.IsPublic = dto.IsPublic;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.SiteSettings.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (entity is null) return false;

        _context.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static SiteSettingDto Map(SiteSetting entity) => new()
    {
        Id = entity.Id,
        Key = entity.Key,
        Value = entity.Value,
        Group = entity.Group,
        IsPublic = entity.IsPublic,
        UpdatedAt = entity.UpdatedAt
    };
}

public class SeoSettingService : ISeoSettingService
{
    private readonly IApplicationDbContext _context;

    public SeoSettingService(IApplicationDbContext context) => _context = context;

    public async Task<List<SeoSettingDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SeoSettings.OrderBy(s => s.PageKey)
            .Select(s => Map(s))
            .ToListAsync(cancellationToken);
    }

    public async Task<SeoSettingDto?> GetByPageKeyAsync(string pageKey, CancellationToken cancellationToken = default)
    {
        var entity = await _context.SeoSettings.FirstOrDefaultAsync(s => s.PageKey == pageKey, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<SeoSettingDto> CreateAsync(CreateSeoSettingDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new SeoSetting
        {
            PageKey = dto.PageKey,
            Title = dto.Title,
            Description = dto.Description,
            Keywords = dto.Keywords,
            OgImage = dto.OgImage,
            IsPublished = dto.IsPublished,
            MaintenanceMessage = dto.MaintenanceMessage
        };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<SeoSettingDto?> UpdateAsync(Guid id, UpdateSeoSettingDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.SeoSettings.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (entity is null) return null;

        entity.Title = dto.Title;
        entity.Description = dto.Description;
        entity.Keywords = dto.Keywords;
        entity.OgImage = dto.OgImage;
        entity.IsPublished = dto.IsPublished;
        entity.MaintenanceMessage = dto.MaintenanceMessage;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.SeoSettings.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (entity is null) return false;

        _context.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static SeoSettingDto Map(SeoSetting entity) => new()
    {
        Id = entity.Id,
        PageKey = entity.PageKey,
        Title = entity.Title,
        Description = entity.Description,
        Keywords = entity.Keywords,
        OgImage = entity.OgImage,
        IsPublished = entity.IsPublished,
        MaintenanceMessage = entity.MaintenanceMessage,
        UpdatedAt = entity.UpdatedAt
    };
}
