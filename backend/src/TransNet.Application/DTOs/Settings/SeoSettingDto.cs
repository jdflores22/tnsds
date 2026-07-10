namespace TransNet.Application.DTOs.Settings;

public class SeoSettingDto
{
    public Guid Id { get; set; }
    public string PageKey { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Keywords { get; set; } = string.Empty;
    public string OgImage { get; set; } = string.Empty;
    public bool IsPublished { get; set; } = true;
    public string MaintenanceMessage { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; }
}

public class CreateSeoSettingDto
{
    public string PageKey { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Keywords { get; set; } = string.Empty;
    public string OgImage { get; set; } = string.Empty;
    public bool IsPublished { get; set; } = true;
    public string MaintenanceMessage { get; set; } = string.Empty;
}

public class UpdateSeoSettingDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Keywords { get; set; } = string.Empty;
    public string OgImage { get; set; } = string.Empty;
    public bool IsPublished { get; set; } = true;
    public string MaintenanceMessage { get; set; } = string.Empty;
}
