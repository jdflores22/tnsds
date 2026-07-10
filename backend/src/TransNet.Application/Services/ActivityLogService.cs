using Microsoft.EntityFrameworkCore;
using TransNet.Application.Common;
using TransNet.Application.DTOs.ActivityLogs;
using TransNet.Application.Interfaces;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public class ActivityLogService : IActivityLogService
{
    private readonly IApplicationDbContext _context;

    public ActivityLogService(IApplicationDbContext context) => _context = context;

    public async Task<(List<ActivityLogDto> Items, ResponseMeta Meta)> GetLogsAsync(
        int page,
        int pageSize,
        string? search = null,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.ActivityLogs
            .Include(a => a.User)
            .OrderByDescending(a => a.Timestamp)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(a =>
                a.Action.ToLower().Contains(term) ||
                a.Entity.ToLower().Contains(term) ||
                a.Details.ToLower().Contains(term) ||
                (a.User.FirstName + " " + a.User.LastName).ToLower().Contains(term) ||
                a.User.Email.ToLower().Contains(term));
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new ActivityLogDto
            {
                Id = a.Id,
                UserId = a.UserId,
                UserName = a.User.FirstName + " " + a.User.LastName,
                Action = a.Action,
                Entity = a.Entity,
                EntityId = a.EntityId,
                Details = a.Details,
                Timestamp = a.Timestamp,
            })
            .ToListAsync(cancellationToken);

        return (items, QueryExtensions.BuildMeta(total, page, pageSize));
    }
}
