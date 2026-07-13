namespace TransNet.Application.Common;

public enum EmailSendOutcome
{
    Sent,
    SkippedNotConfigured,
    Failed
}

public sealed class EmailSendResult
{
    public EmailSendOutcome Outcome { get; init; }
    public string To { get; init; } = string.Empty;
    public string? Error { get; init; }

    public bool IsSent => Outcome == EmailSendOutcome.Sent;

    public static EmailSendResult SentTo(string to) => new() { Outcome = EmailSendOutcome.Sent, To = to };

    public static EmailSendResult Skipped(string to, string reason) => new()
    {
        Outcome = EmailSendOutcome.SkippedNotConfigured,
        To = to,
        Error = reason,
    };

    public static EmailSendResult Failed(string to, string error) => new()
    {
        Outcome = EmailSendOutcome.Failed,
        To = to,
        Error = error,
    };
}

public sealed record EmailConfigurationStatus
{
    public bool IsConfigured { get; init; }
    public string Provider { get; init; } = SmtpSettingsKeys.ProviderSmtp;
    public string? Host { get; init; }
    public int Port { get; init; }
    public string? From { get; init; }
    public string? Username { get; init; }
    public bool EnableSsl { get; init; }
    public string? ConfigurationHint { get; init; }
    public string ConfigSource { get; init; } = "database";
    public bool UsesContactEmailAsLogin { get; init; }
    public bool HasPassword { get; init; }
    public bool HasApiToken { get; init; }
}
