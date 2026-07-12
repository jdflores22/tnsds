using TransNet.Domain.Common;

namespace TransNet.Domain.Entities;

public class CompanyHighlight : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    /// <summary>Homepage grid row (1 = first row, 2 = second row).</summary>
    public int HomepageRow { get; set; } = 1;
}
