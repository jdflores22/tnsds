using Microsoft.EntityFrameworkCore;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Common;

public static class SiteSettingsReader
{
    public const string CompanyEmailKey = "company_email";

    public static async Task<string?> GetValueAsync(
        IApplicationDbContext context,
        string key,
        CancellationToken cancellationToken = default)
    {
        return await context.SiteSettings
            .Where(s => s.Key == key)
            .Select(s => s.Value)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public static async Task<string> GetCompanyEmailAsync(
        IApplicationDbContext context,
        CancellationToken cancellationToken = default)
    {
        var email = (await GetValueAsync(context, CompanyEmailKey, cancellationToken))?.Trim();
        return string.IsNullOrWhiteSpace(email) ? "info@trans-net.com" : email;
    }
}
