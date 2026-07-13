using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TransNet.Application.Common;
using TransNet.Application.DTOs.Settings;
using TransNet.Application.Interfaces;
using TransNet.Domain.Interfaces;

namespace TransNet.API.Controllers;

[ApiController]
[Route("api/v1/email")]
[Authorize(Roles = ApiConstants.AdminRoles)]
public class EmailController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly IApplicationDbContext _context;

    public EmailController(IEmailService emailService, IApplicationDbContext context)
    {
        _emailService = emailService;
        _context = context;
    }

    [HttpGet("status")]
    public async Task<ActionResult<ApiResponse<EmailStatusDto>>> GetStatus(CancellationToken cancellationToken)
    {
        var config = _emailService.GetConfigurationStatus();
        var companyEmail = await SiteSettingsReader.GetCompanyEmailAsync(_context, cancellationToken);

        return Ok(ApiResponse<EmailStatusDto>.Ok(new EmailStatusDto
        {
            IsConfigured = config.IsConfigured,
            Host = config.Host,
            Port = config.Port,
            From = config.From,
            Username = config.Username,
            EnableSsl = config.EnableSsl,
            CompanyEmail = companyEmail,
            ConfigurationHint = config.ConfigurationHint,
        }));
    }

    [HttpPost("test")]
    public async Task<ActionResult<ApiResponse<EmailTestResultDto>>> SendTest(
        [FromBody] SendTestEmailDto? dto,
        CancellationToken cancellationToken)
    {
        var config = _emailService.GetConfigurationStatus();
        var companyEmail = await SiteSettingsReader.GetCompanyEmailAsync(_context, cancellationToken);
        var to = string.IsNullOrWhiteSpace(dto?.To) ? companyEmail : dto!.To.Trim();

        if (string.IsNullOrWhiteSpace(to))
        {
            return BadRequest(ApiResponse<EmailTestResultDto>.Fail("No recipient email. Set company_email in Contact settings or pass To in the request body."));
        }

        var result = await _emailService.SendAsync(
            to,
            "TRANS-NET test email",
            "<p>This is a test message from the TRANS-NET admin panel.</p><p>If you received this, SMTP is configured correctly.</p>",
            cancellationToken);

        var response = new EmailTestResultDto
        {
            To = to,
            Outcome = result.Outcome.ToString(),
            Success = result.IsSent,
            Message = result.Outcome switch
            {
                EmailSendOutcome.Sent => $"Test email sent to {to}.",
                EmailSendOutcome.SkippedNotConfigured => result.Error ?? "SMTP is not configured.",
                EmailSendOutcome.Failed => result.Error ?? "SMTP send failed.",
                _ => "Unknown result.",
            },
        };

        if (result.IsSent)
            return Ok(ApiResponse<EmailTestResultDto>.Ok(response));

        return BadRequest(new ApiResponse<EmailTestResultDto>
        {
            Data = response,
            Errors = new List<string> { response.Message },
        });
    }
}
