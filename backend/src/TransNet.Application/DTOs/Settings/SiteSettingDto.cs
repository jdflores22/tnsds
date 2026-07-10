namespace TransNet.Application.DTOs.Settings;

public class SiteSettingDto
{
    public Guid Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Group { get; set; } = string.Empty;
    public bool IsPublic { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateSiteSettingDto
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Group { get; set; } = "general";
    public bool IsPublic { get; set; }
}

public class UpdateSiteSettingDto
{
    public string Value { get; set; } = string.Empty;
    public string Group { get; set; } = "general";
    public bool IsPublic { get; set; }
}
