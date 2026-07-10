using TransNet.Application.Common;
using TransNet.Application.DTOs.ActivityLogs;

namespace TransNet.Application.Interfaces;

public interface IActivityLogService
{
    Task<(List<ActivityLogDto> Items, ResponseMeta Meta)> GetLogsAsync(
        int page,
        int pageSize,
        string? search = null,
        CancellationToken cancellationToken = default);
}
