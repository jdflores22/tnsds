using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TransNet.Application.Common;
using TransNet.Application.Interfaces;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public class SmtpSettingsProvider : ISmtpSettingsProvider
{
    private readonly IApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public SmtpSettingsProvider(IApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<SmtpSettings> GetAsync(CancellationToken cancellationToken = default)
    {
        var keys = new[]
        {
            SmtpSettingsKeys.Provider,
            SmtpSettingsKeys.HostingerApiToken,
            SmtpSettingsKeys.Host,
            SmtpSettingsKeys.Port,
            SmtpSettingsKeys.Username,
            SmtpSettingsKeys.Password,
            SmtpSettingsKeys.EnableSsl,
            SiteSettingsReader.CompanyEmailKey,
        };

        var settings = await _context.SiteSettings
            .Where(s => keys.Contains(s.Key))
            .ToDictionaryAsync(s => s.Key, s => s.Value, cancellationToken);

        var companyEmail = settings.GetValueOrDefault(SiteSettingsReader.CompanyEmailKey)?.Trim();
        if (string.IsNullOrWhiteSpace(companyEmail))
            companyEmail = "info@trans-net.com";

        var dbProvider = settings.GetValueOrDefault(SmtpSettingsKeys.Provider)?.Trim();
        var dbApiToken = settings.GetValueOrDefault(SmtpSettingsKeys.HostingerApiToken);
        var dbHost = settings.GetValueOrDefault(SmtpSettingsKeys.Host)?.Trim();
        var dbUsername = settings.GetValueOrDefault(SmtpSettingsKeys.Username)?.Trim();
        var dbPassword = settings.GetValueOrDefault(SmtpSettingsKeys.Password);
        var dbPortRaw = settings.GetValueOrDefault(SmtpSettingsKeys.Port)?.Trim();
        var dbEnableSslRaw = settings.GetValueOrDefault(SmtpSettingsKeys.EnableSsl)?.Trim();

        var env = _configuration.GetSection("Smtp");
        var envHost = env["Host"]?.Trim();
        var envUsername = env["Username"]?.Trim();
        var envPassword = env["Password"];
        var envFrom = env["From"]?.Trim() ?? env["FromEmail"]?.Trim();

        var hostingerEnv = _configuration["HostingerMail:ApiToken"]?.Trim();

        var apiToken = FirstNonEmpty(dbApiToken, hostingerEnv);
        var provider = FirstNonEmpty(dbProvider, !string.IsNullOrWhiteSpace(apiToken) ? SmtpSettingsKeys.ProviderHostingerApi : SmtpSettingsKeys.ProviderSmtp)
            ?? SmtpSettingsKeys.ProviderSmtp;

        var host = FirstNonEmpty(dbHost, envHost);
        var explicitUsername = FirstNonEmpty(dbUsername, envUsername);
        var usesContactEmail = string.IsNullOrWhiteSpace(explicitUsername);
        var username = usesContactEmail ? companyEmail : explicitUsername;
        var password = FirstNonEmpty(dbPassword, envPassword);
        var port = ParsePort(dbPortRaw, env["Port"]);
        var enableSsl = ParseBool(dbEnableSslRaw, env["EnableSsl"], defaultValue: true);
        var from = FirstNonEmpty(username, envFrom) ?? companyEmail;

        var hasDbConfig = !string.IsNullOrWhiteSpace(dbHost)
            || !string.IsNullOrWhiteSpace(dbUsername)
            || !string.IsNullOrWhiteSpace(dbPassword)
            || !string.IsNullOrWhiteSpace(dbApiToken);
        var source = hasDbConfig
            ? "database"
            : !string.IsNullOrWhiteSpace(envHost) || !string.IsNullOrWhiteSpace(hostingerEnv)
                ? "environment"
                : "database";

        return new SmtpSettings
        {
            Provider = provider,
            HostingerApiToken = apiToken,
            Host = host,
            Port = port,
            Username = username,
            Password = password,
            From = from,
            EnableSsl = enableSsl,
            Source = source,
            UsesContactEmailAsLogin = usesContactEmail,
            CompanyEmail = companyEmail,
        };
    }

    public EmailConfigurationStatus BuildStatus(SmtpSettings settings)
    {
        if (settings.UsesHostingerApi)
        {
            string? hint = null;
            if (string.IsNullOrWhiteSpace(settings.HostingerApiToken))
            {
                hint = "Add your Hostinger Mail API token in Admin → Settings → Contact.";
            }
            else if (settings.UsesContactEmailAsLogin)
            {
                hint = $"Using Hostinger Mail API. Send-as follows contact email ({settings.CompanyEmail}) when that mailbox is included in your token.";
            }

            return new EmailConfigurationStatus
            {
                IsConfigured = !string.IsNullOrWhiteSpace(settings.HostingerApiToken),
                Provider = SmtpSettingsKeys.ProviderHostingerApi,
                Host = "api.mail.hostinger.com",
                Port = 443,
                From = settings.From,
                Username = settings.Username,
                EnableSsl = true,
                ConfigurationHint = hint,
                ConfigSource = settings.Source,
                UsesContactEmailAsLogin = settings.UsesContactEmailAsLogin,
                HasPassword = false,
                HasApiToken = !string.IsNullOrWhiteSpace(settings.HostingerApiToken),
            };
        }

        string? smtpHint = null;
        if (string.IsNullOrWhiteSpace(settings.Host))
        {
            smtpHint = "Set SMTP server in Admin → Settings → Contact, or switch to Hostinger Mail API.";
        }
        else if (string.IsNullOrWhiteSpace(settings.Password))
        {
            smtpHint = "SMTP password is missing. Add it in Admin → Settings → Contact.";
        }
        else if (!string.Equals(settings.From, settings.Username, StringComparison.OrdinalIgnoreCase))
        {
            smtpHint = "SMTP login must match the sender address. Leave SMTP login blank to use the contact email automatically.";
        }
        else if (settings.UsesContactEmailAsLogin)
        {
            smtpHint = $"Using contact email ({settings.CompanyEmail}) as SMTP login. Update the SMTP password if you change the contact email.";
        }

        return new EmailConfigurationStatus
        {
            IsConfigured = !string.IsNullOrWhiteSpace(settings.Host)
                && !string.IsNullOrWhiteSpace(settings.Username)
                && !string.IsNullOrWhiteSpace(settings.Password),
            Provider = SmtpSettingsKeys.ProviderSmtp,
            Host = settings.Host,
            Port = settings.Port,
            From = settings.From,
            Username = settings.Username,
            EnableSsl = settings.EnableSsl,
            ConfigurationHint = smtpHint,
            ConfigSource = settings.Source,
            UsesContactEmailAsLogin = settings.UsesContactEmailAsLogin,
            HasPassword = !string.IsNullOrWhiteSpace(settings.Password),
            HasApiToken = false,
        };
    }

    private static string? FirstNonEmpty(params string?[] values)
    {
        foreach (var value in values)
        {
            if (!string.IsNullOrWhiteSpace(value))
                return value.Trim();
        }

        return null;
    }

    private static int ParsePort(string? primary, string? fallback)
    {
        if (int.TryParse(primary, out var port) && port > 0)
            return port;
        if (int.TryParse(fallback, out port) && port > 0)
            return port;
        return 465;
    }

    private static bool ParseBool(string? primary, string? fallback, bool defaultValue)
    {
        if (bool.TryParse(primary, out var parsed))
            return parsed;
        if (bool.TryParse(fallback, out parsed))
            return parsed;
        return defaultValue;
    }
}
