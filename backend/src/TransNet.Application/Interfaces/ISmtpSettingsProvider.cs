using TransNet.Application.Common;

namespace TransNet.Application.Interfaces;

public interface ISmtpSettingsProvider
{
    Task<SmtpSettings> GetAsync(CancellationToken cancellationToken = default);

    EmailConfigurationStatus BuildStatus(SmtpSettings settings);
}
