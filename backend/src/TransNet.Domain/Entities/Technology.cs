using TransNet.Domain.Common;

namespace TransNet.Domain.Entities;

public class Technology : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string IconUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
