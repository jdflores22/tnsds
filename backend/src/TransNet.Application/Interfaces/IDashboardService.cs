using TransNet.Application.DTOs.Dashboard;

namespace TransNet.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync(CancellationToken cancellationToken = default);
}
