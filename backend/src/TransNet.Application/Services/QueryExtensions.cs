using TransNet.Application.Common;
using TransNet.Domain.Common;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public static class QueryExtensions
{
    public static IQueryable<T> ApplyPublicFilter<T>(IQueryable<T> query, bool adminView) where T : BaseEntity
    {
        if (adminView)
            return query.Where(e => !e.IsDeleted);

        return query.Where(e => e.IsPublished && !e.IsDeleted);
    }

    public static ResponseMeta BuildMeta(int total, int page, int pageSize) =>
        new()
        {
            Total = total,
            Page = page,
            PageSize = pageSize,
            TotalPages = pageSize > 0 ? (int)Math.Ceiling(total / (double)pageSize) : 0
        };

    public static Task<(List<T> Items, ResponseMeta Meta)> ToPagedListAsync<T>(
        IQueryable<T> query, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var total = query.Count();
        var items = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        return Task.FromResult((items, BuildMeta(total, page, pageSize)));
    }
}
