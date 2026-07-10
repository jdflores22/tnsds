using TransNet.Domain.Common;

namespace TransNet.Domain.Entities;

public class ProcessStep : BaseEntity
{
    public string StepLabel { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
