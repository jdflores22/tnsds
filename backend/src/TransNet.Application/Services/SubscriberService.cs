using Microsoft.EntityFrameworkCore;
using TransNet.Application.Common;
using TransNet.Application.DTOs.Subscribers;
using TransNet.Application.Interfaces;
using TransNet.Domain.Entities;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public class SubscriberService : ISubscriberService
{
    private readonly IApplicationDbContext _context;

    public SubscriberService(IApplicationDbContext context) => _context = context;

    public async Task<(List<SubscriberDto> Items, ResponseMeta Meta)> GetAllAsync(int page = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = _context.Subscribers.OrderByDescending(s => s.SubscribedAt);
        var (items, meta) = await QueryExtensions.ToPagedListAsync(query, page, pageSize, cancellationToken);
        return (items.Select(Map).ToList(), meta);
    }

    public async Task<SubscriberDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Subscribers.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<SubscriberDto> SubscribeAsync(CreateSubscriberDto dto, CancellationToken cancellationToken = default)
    {
        var existing = await _context.Subscribers.FirstOrDefaultAsync(s => s.Email == dto.Email, cancellationToken);
        if (existing is not null)
        {
            existing.IsActive = true;
            existing.SubscribedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
            return Map(existing);
        }

        var entity = new Subscriber { Email = dto.Email };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> UnsubscribeAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Subscribers.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (entity is null) return false;

        entity.IsActive = false;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Subscribers.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (entity is null) return false;

        _context.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static SubscriberDto Map(Subscriber entity) => new()
    {
        Id = entity.Id,
        Email = entity.Email,
        SubscribedAt = entity.SubscribedAt,
        IsActive = entity.IsActive
    };
}
