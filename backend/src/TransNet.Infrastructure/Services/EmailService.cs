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
    private readonly HostingerMailClient _hostingerMail;
    private readonly ILogger<EmailService> _logger;

    public EmailService(
        ISmtpSettingsProvider smtpSettings,
        HostingerMailClient hostingerMail,
        ILogger<EmailService> logger)
    {
        _smtpSettings = smtpSettings;
        _hostingerMail = hostingerMail;
        _logger = logger;
    }

    public async Task<EmailConfigurationStatus> GetConfigurationStatusAsync(CancellationToken cancellationToken = default)
    {
        var settings = await _smtpSettings.GetAsync(cancellationToken);
        var status = _smtpSettings.BuildStatus(settings);

        if (!settings.UsesHostingerApi || string.IsNullOrWhiteSpace(settings.HostingerApiToken))
            return status;

        try
        {
            var mailbox = await _hostingerMail.ResolveMailboxAsync(
                settings.HostingerApiToken!,
                settings.From ?? settings.CompanyEmail,
                cancellationToken);

            return status with
            {
                IsConfigured = mailbox is not null,
                From = mailbox?.Address ?? status.From,
                Username = mailbox?.Address ?? status.Username,
                ConfigurationHint = mailbox is null
                    ? $"No Hostinger mailbox found for {settings.From ?? settings.CompanyEmail}. Ensure your API token includes that mailbox."
                    : status.ConfigurationHint,
            };
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to verify Hostinger Mail API token");
            return status with
            {
                IsConfigured = false,
                ConfigurationHint = $"Hostinger Mail API token check failed: {ex.Message}",
            };
        }
    }

    public async Task<EmailSendResult> SendAsync(string to, string subject, string body, CancellationToken cancellationToken = default)
    {
        var settings = await _smtpSettings.GetAsync(cancellationToken);

        if (settings.UsesHostingerApi)
            return await SendViaHostingerApiAsync(settings, to, subject, body, cancellationToken);

        return await SendViaSmtpAsync(settings, to, subject, body, cancellationToken);
    }

    private async Task<EmailSendResult> SendViaHostingerApiAsync(
        SmtpSettings settings,
        string to,
        string subject,
        string body,
        CancellationToken cancellationToken)
    {
        var status = _smtpSettings.BuildStatus(settings);
        if (string.IsNullOrWhiteSpace(settings.HostingerApiToken))
        {
            var reason = status.ConfigurationHint ?? "Hostinger Mail API token is not configured.";
            _logger.LogWarning("Email to {To} skipped: {Reason}", to, reason);
            return EmailSendResult.Skipped(to, reason);
        }

        var sendAs = settings.From ?? settings.CompanyEmail;

        try
        {
            var mailbox = await _hostingerMail.ResolveMailboxAsync(
                settings.HostingerApiToken,
                sendAs,
                cancellationToken);

            if (mailbox is null)
            {
                return EmailSendResult.Failed(
                    to,
                    $"No Hostinger mailbox found for {sendAs}. Create the mailbox in hPanel and include it in your API token scope.");
            }

            await _hostingerMail.SendAsync(
                settings.HostingerApiToken,
                mailbox.ResourceId,
                to,
                subject,
                body,
                displayName: "TRANS-NET",
                cancellationToken);

            _logger.LogInformation("Email sent via Hostinger Mail API to {To} with subject {Subject}", to, subject);
            return EmailSendResult.SentTo(to);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email via Hostinger Mail API to {To}", to);
            return EmailSendResult.Failed(to, ex.Message);
        }
    }

    private async Task<EmailSendResult> SendViaSmtpAsync(
        SmtpSettings settings,
        string to,
        string subject,
        string body,
        CancellationToken cancellationToken)
    {
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
            return EmailSendResult.Failed(to, ToFriendlySmtpError(ex));
        }
    }

    private static string ToFriendlySmtpError(Exception ex)
    {
        var msg = ex.Message;
        if (msg.Contains("Client host rejected", StringComparison.OrdinalIgnoreCase)
            || msg.Contains("Access denied", StringComparison.OrdinalIgnoreCase)
            || msg.Contains("Relay access denied", StringComparison.OrdinalIgnoreCase))
        {
            return $"{msg} Try Hostinger Mail API instead (HTTPS) in Admin → Settings → Contact.";
        }

        if (msg.Contains("Authentication", StringComparison.OrdinalIgnoreCase)
            || msg.Contains("535", StringComparison.OrdinalIgnoreCase))
        {
            return $"{msg} SMTP login must be the full email address and the password must match the mailbox password.";
        }

        return msg;
    }
}
