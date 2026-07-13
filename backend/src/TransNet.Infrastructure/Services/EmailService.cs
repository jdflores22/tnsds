using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using TransNet.Application.Common;
using TransNet.Application.Interfaces;

namespace TransNet.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public EmailConfigurationStatus GetConfigurationStatus()
    {
        var smtp = _configuration.GetSection("Smtp");
        var host = smtp["Host"]?.Trim();
        var username = smtp["Username"]?.Trim();
        var from = smtp["From"]?.Trim() ?? username;
        var port = int.TryParse(smtp["Port"], out var parsedPort) ? parsedPort : 587;
        var enableSsl = !bool.TryParse(smtp["EnableSsl"], out var parsedSsl) || parsedSsl;
        var isConfigured = !string.IsNullOrWhiteSpace(host);

        string? hint = null;
        if (!isConfigured)
        {
            hint = "Set Smtp:Host (and Username/Password) in appsettings.Development.json or environment variables Smtp__Host, Smtp__Username, Smtp__Password.";
        }
        else if (string.IsNullOrWhiteSpace(username))
        {
            hint = "Smtp:Host is set but Smtp:Username is empty.";
        }

        return new EmailConfigurationStatus
        {
            IsConfigured = isConfigured && !string.IsNullOrWhiteSpace(username),
            Host = host,
            Port = port,
            From = from,
            Username = username,
            EnableSsl = enableSsl,
            ConfigurationHint = hint,
        };
    }

    public async Task<EmailSendResult> SendAsync(string to, string subject, string body, CancellationToken cancellationToken = default)
    {
        var status = GetConfigurationStatus();
        if (!status.IsConfigured)
        {
            var reason = status.ConfigurationHint ?? "SMTP is not configured.";
            _logger.LogWarning("Email to {To} skipped: {Reason}", to, reason);
            return EmailSendResult.Skipped(to, reason);
        }

        var smtp = _configuration.GetSection("Smtp");
        try
        {
            using var client = new SmtpClient(status.Host, status.Port)
            {
                EnableSsl = status.EnableSsl,
                Credentials = new NetworkCredential(status.Username, smtp["Password"]),
            };

            var from = status.From ?? status.Username!;
            using var message = new MailMessage(from, to, subject, body) { IsBodyHtml = true };

            await client.SendMailAsync(message, cancellationToken);
            _logger.LogInformation("Email sent to {To} with subject {Subject}", to, subject);
            return EmailSendResult.SentTo(to);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To}", to);
            return EmailSendResult.Failed(to, ex.Message);
        }
    }
}
