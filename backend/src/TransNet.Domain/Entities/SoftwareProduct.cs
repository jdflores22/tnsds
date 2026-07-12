using TransNet.Domain.Common;

namespace TransNet.Domain.Entities;

public class SoftwareProduct : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    /// <summary>Long-form product description (HTML supported on frontend).</summary>
    public string Description { get; set; } = string.Empty;
    /// <summary>JSON array of feature strings.</summary>
    public string FeaturesJson { get; set; } = "[]";
    /// <summary>JSON array of screenshot image URLs.</summary>
    public string ScreenshotsJson { get; set; } = "[]";
    public string LogoUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    /// <summary>When true, shown in the homepage featured product spotlight (only one at a time).</summary>
    public bool IsFeatured { get; set; }
    /// <summary>Homepage grid row (1 = first row, 2 = second row).</summary>
    public int HomepageRow { get; set; } = 1;
}
