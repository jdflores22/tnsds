using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using MimeKit;
using TransNet.Application.Common;
using TransNet.Application.Interfaces;

namespace TransNet.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly ISmtpSettingsProvider _smtpSettings;
    private readonly ILogger<EmailService> _logger;

    public EmailService(ISmtpSettingsProvider smtpSettings, ILogger<EmailService> logger)
    {
        _smtpSettings = smtpSettings;
        _logger = logger;
    }

    public async Task<EmailConfigurationStatus> GetConfigurationStatusAsync(CancellationToken cancellationToken = default)
    {
        var settings = await _smtpSettings.GetAsync(cancellationToken);
        var status = _smtpSettings.BuildStatus(settings);
        return new EmailConfigurationStatus
        {
            IsConfigured = status.IsConfigured,
            Host = status.Host,
            Port = status.Port,
            From = status.From,
            Username = status.Username,
            EnableSsl = status.EnableSsl,
            ConfigurationHint = status.ConfigurationHint,
            ConfigSource = settings.Source,
            UsesContactEmailAsLogin = settings.UsesContactEmailAsLogin,
            HasPassword = !string.IsNullOrWhiteSpace(settings.Password),
        };
    }

    public async Task<EmailSendResult> SendAsync(string to, string subject, string body, CancellationToken cancellationToken = default)
    {
        var settings = await _smtpSettings.GetAsync(cancellationToken);
        var status = _smtpSettings.BuildStatus(settings);
        if (!status.IsConfigured)
        {
            var reason = status.ConfigurationHint ?? "SMTP is not configured.";
            _logger.LogWarning("Email to {To} skipped: {Reason}", to, reason);
            return EmailSendResult.Skipped(to, reason);
        }

        var from = settings.From ?? settings.Username!;
        var password = settings.Password ?? string.Empty;

        try
        {
            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(from));
            message.To.Add(MailboxAddress.Parse(to));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = body };

            var secureSocketOptions = settings.Port switch
            {
                465 => SecureSocketOptions.SslOnConnect,
                587 => SecureSocketOptions.StartTls,
                _ => settings.EnableSsl ? SecureSocketOptions.Auto : SecureSocketOptions.None,
            };

            using var client = new SmtpClient();
            await client.ConnectAsync(settings.Host, settings.Port, secureSocketOptions, cancellationToken);
            await client.AuthenticateAsync(settings.Username, password, cancellationToken);
            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);

            _logger.LogInformation("Email sent to {To} with subject {Subject}", to, subject);
            return EmailSendResult.SentTo(to);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To}", to);
            return EmailSendResult.Failed(to, ToFriendlyError(ex));
        }
    }

    private static string ToFriendlyError(Exception ex)
    {
        var msg = ex.Message;
        if (msg.Contains("Client host rejected", StringComparison.OrdinalIgnoreCase)
            || msg.Contains("Access denied", StringComparison.OrdinalIgnoreCase)
            || msg.Contains("Relay access denied", StringComparison.OrdinalIgnoreCase))
        {
            return $"{msg} Check: (1) SMTP login matches the sender address, (2) mailbox password is correct, (3) use port 465 for Hostinger, (4) SPF/DKIM DNS records exist. Some networks block Hostinger SMTP — use Brevo or Resend on Railway if needed.";
        }

        if (msg.Contains("Authentication", StringComparison.OrdinalIgnoreCase)
            || msg.Contains("535", StringComparison.OrdinalIgnoreCase))
        {
            return $"{msg} SMTP login must be the full email address and the password must match the mailbox password.";
        }

        return msg;
    }
}
