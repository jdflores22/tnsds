using TransNet.Application.Common;

namespace TransNet.Application.Interfaces;

public interface IEmailService
{
    EmailConfigurationStatus GetConfigurationStatus();

    Task<EmailSendResult> SendAsync(string to, string subject, string body, CancellationToken cancellationToken = default);
}
