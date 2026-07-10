using Microsoft.EntityFrameworkCore;
using TransNet.Application.DTOs.Dashboard;
using TransNet.Application.Interfaces;
using TransNet.Domain.Enums;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IApplicationDbContext _context;

    public DashboardService(IApplicationDbContext context) => _context = context;

    public async Task<DashboardStatsDto> GetStatsAsync(CancellationToken cancellationToken = default)
    {
        return new DashboardStatsDto
        {
            TotalProjects = await _context.Projects.CountAsync(p => !p.IsDeleted, cancellationToken),
            TotalServices = await _context.Services.CountAsync(s => !s.IsDeleted, cancellationToken),
            TotalClients = await _context.Clients.CountAsync(c => !c.IsDeleted, cancellationToken),
            TotalBlogs = await _context.Blogs.CountAsync(b => !b.IsDeleted, cancellationToken),
            TotalMessages = await _context.ContactMessages.CountAsync(cancellationToken),
            NewMessages = await _context.ContactMessages.CountAsync(m => m.Status == MessageStatus.New, cancellationToken),
            TotalSubscribers = await _context.Subscribers.CountAsync(s => s.IsActive, cancellationToken),
            TotalJobApplications = await _context.JobApplications.CountAsync(cancellationToken),
            TotalUsers = await _context.Users.CountAsync(u => u.IsActive, cancellationToken)
        };
    }
}
