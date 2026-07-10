using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using TransNet.Application.Interfaces;

namespace TransNet.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;
    private readonly bool _isConfigured;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
        var smtp = _configuration.GetSection("Smtp");
        _isConfigured = !string.IsNullOrWhiteSpace(smtp["Host"]);
    }

    public async Task SendAsync(string to, string subject, string body, CancellationToken cancellationToken = default)
    {
        if (!_isConfigured)
        {
            _logger.LogDebug("SMTP not configured, skipping email to {To}", to);
            return;
        }

        var smtp = _configuration.GetSection("Smtp");
        using var client = new SmtpClient(smtp["Host"], int.Parse(smtp["Port"] ?? "587"))
        {
            EnableSsl = bool.Parse(smtp["EnableSsl"] ?? "true"),
            Credentials = new NetworkCredential(smtp["Username"], smtp["Password"])
        };

        var from = smtp["From"] ?? smtp["Username"];
        using var message = new MailMessage(from!, to, subject, body) { IsBodyHtml = true };

        try
        {
            await client.SendMailAsync(message, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To}", to);
        }
    }
}
