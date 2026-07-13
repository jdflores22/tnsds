using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;

namespace TransNet.Infrastructure.Services;

public sealed class HostingerMailClient
{
    private const string BaseUrl = "https://api.mail.hostinger.com";
    private readonly HttpClient _httpClient;
    private readonly ILogger<HostingerMailClient> _logger;

    public HostingerMailClient(HttpClient httpClient, ILogger<HostingerMailClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<HostingerMailbox?> ResolveMailboxAsync(
        string apiToken,
        string emailAddress,
        CancellationToken cancellationToken = default)
    {
        var account = await GetAccountAsync(apiToken, cancellationToken);
        if (account?.Mailboxes is null)
            return null;

        return account.Mailboxes.FirstOrDefault(m =>
            string.Equals(m.Address, emailAddress, StringComparison.OrdinalIgnoreCase));
    }

    public async Task SendAsync(
        string apiToken,
        string mailboxResourceId,
        string to,
        string subject,
        string htmlBody,
        string? displayName,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(mailboxResourceId))
        {
            throw new InvalidOperationException(
                "Hostinger mailbox resource ID is missing. Ensure your contact email matches a mailbox included in your Agentic Mail API token.");
        }

        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"{BaseUrl}/api/v1/mailboxes/{Uri.EscapeDataString(mailboxResourceId)}/send");

        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiToken);
        request.Content = JsonContent.Create(new HostingerSendRequest
        {
            To = new[] { to },
            Subject = subject,
            Html = htmlBody,
            DisplayName = displayName,
        });

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        if (response.IsSuccessStatusCode)
            return;

        var body = await response.Content.ReadAsStringAsync(cancellationToken);
        _logger.LogWarning(
            "Hostinger Mail API send failed ({StatusCode}): {Body}",
            (int)response.StatusCode,
            body);

        throw new InvalidOperationException(
            $"Hostinger Mail API returned {(int)response.StatusCode}: {FormatApiErrorBody((int)response.StatusCode, body)}");
    }

    private static string FormatApiErrorBody(int statusCode, string body)
    {
        if (string.IsNullOrWhiteSpace(body))
            return "(empty response)";

        if (body.TrimStart().StartsWith('<'))
        {
            return statusCode == 404
                ? "Endpoint not found. Verify the mailbox is included in your Agentic Mail API token and the contact email matches that mailbox."
                : "Unexpected HTML error page from Hostinger Mail API.";
        }

        return body.Length > 500 ? body[..500] + "…" : body;
    }

    private async Task<HostingerAccountData?> GetAccountAsync(
        string apiToken,
        CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, $"{BaseUrl}/api/v1/me");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiToken);

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new InvalidOperationException(
                $"Hostinger Mail API auth failed ({(int)response.StatusCode}): {FormatApiErrorBody((int)response.StatusCode, body)}");
        }

        var payload = await response.Content.ReadFromJsonAsync<HostingerMeResponse>(cancellationToken: cancellationToken);
        return payload?.Data;
    }

    private sealed class HostingerMeResponse
    {
        [JsonPropertyName("data")]
        public HostingerAccountData? Data { get; set; }
    }

    private sealed class HostingerAccountData
    {
        [JsonPropertyName("mailboxes")]
        public List<HostingerMailbox>? Mailboxes { get; set; }
    }

    public sealed class HostingerMailbox
    {
        [JsonPropertyName("resourceId")]
        public string ResourceId { get; set; } = string.Empty;

        [JsonPropertyName("address")]
        public string Address { get; set; } = string.Empty;
    }

    private sealed class HostingerSendRequest
    {
        [JsonPropertyName("to")]
        public string[] To { get; set; } = Array.Empty<string>();

        [JsonPropertyName("subject")]
        public string Subject { get; set; } = string.Empty;

        [JsonPropertyName("html")]
        public string Html { get; set; } = string.Empty;

        [JsonPropertyName("displayName")]
        public string? DisplayName { get; set; }
    }
}
