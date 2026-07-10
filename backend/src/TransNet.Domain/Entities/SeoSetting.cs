namespace TransNet.Domain.Entities;

public class SeoSetting
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string PageKey { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Keywords { get; set; } = string.Empty;
    public string OgImage { get; set; } = string.Empty;
    public bool IsPublished { get; set; } = true;
    public string MaintenanceMessage { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
