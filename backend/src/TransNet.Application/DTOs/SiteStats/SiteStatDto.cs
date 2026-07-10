namespace TransNet.Application.DTOs.SiteStats;

public class SiteStatDto
{
    public Guid Id { get; set; }
    public string Value { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateSiteStatDto
{
    public string Value { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Icon { get; set; } = "users";
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; }
}

public class UpdateSiteStatDto
{
    public string Value { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Icon { get; set; } = "users";
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; }
}
