namespace TransNet.Application.Common;

public static class SmtpSettingsKeys
{
    public const string Group = "email";

    public const string Provider = "email_provider";
    public const string Host = "smtp_host";
    public const string Port = "smtp_port";
    public const string Username = "smtp_username";
    public const string Password = "smtp_password";
    public const string EnableSsl = "smtp_enable_ssl";
    public const string HostingerApiToken = "hostinger_mail_api_token";

    public const string ProviderSmtp = "smtp";
    public const string ProviderHostingerApi = "hostinger_api";

    public static bool IsSecretKey(string key) =>
        key is Password or HostingerApiToken;
}

public sealed class SmtpSettings
{
    public string Provider { get; init; } = SmtpSettingsKeys.ProviderSmtp;
    public string? HostingerApiToken { get; init; }
    public string? Host { get; init; }
    public int Port { get; init; } = 465;
    public string? Username { get; init; }
    public string? Password { get; init; }
    public string? From { get; init; }
    public bool EnableSsl { get; init; } = true;
    /// <summary>database | environment</summary>
    public string Source { get; init; } = "database";
    public bool UsesContactEmailAsLogin { get; init; }
    public string CompanyEmail { get; init; } = string.Empty;

    public bool UsesHostingerApi =>
        string.Equals(Provider, SmtpSettingsKeys.ProviderHostingerApi, StringComparison.OrdinalIgnoreCase)
        || !string.IsNullOrWhiteSpace(HostingerApiToken);
}
