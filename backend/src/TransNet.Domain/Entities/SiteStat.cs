using TransNet.Domain.Common;

namespace TransNet.Domain.Entities;

public class SiteStat : BaseEntity
{
    public string Value { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Icon { get; set; } = "users";
    public int SortOrder { get; set; }
}
