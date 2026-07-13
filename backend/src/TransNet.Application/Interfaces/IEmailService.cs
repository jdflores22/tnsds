using TransNet.Application.Common;

namespace TransNet.Application.Interfaces;

public interface IEmailService
{
    Task<EmailConfigurationStatus> GetConfigurationStatusAsync(CancellationToken cancellationToken = default);

    Task<EmailSendResult> SendAsync(string to, string subject, string body, CancellationToken cancellationToken = default);
}
