using TransNet.Domain.Common;

namespace TransNet.Domain.Entities;

public class SoftwareProduct : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string LogoUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
