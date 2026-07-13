namespace TransNet.Application.DTOs.Settings;

public class SendTestEmailDto
{
    /// <summary>Optional override recipient. Defaults to company_email site setting.</summary>
    public string? To { get; set; }
}

public class EmailStatusDto
{
    public bool IsConfigured { get; set; }
    public string Provider { get; set; } = "smtp";
    public string? Host { get; set; }
    public int Port { get; set; }
    public string? From { get; set; }
    public string? Username { get; set; }
    public bool EnableSsl { get; set; }
    public string CompanyEmail { get; set; } = string.Empty;
    public string? ConfigurationHint { get; set; }
    public string ConfigSource { get; set; } = "database";
    public bool UsesContactEmailAsLogin { get; set; }
    public bool HasPassword { get; set; }
    public bool HasApiToken { get; set; }
}

public class EmailTestResultDto
{
    public bool Success { get; set; }
    public string Outcome { get; set; } = string.Empty;
    public string To { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
