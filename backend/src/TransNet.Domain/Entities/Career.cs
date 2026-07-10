using TransNet.Domain.Common;

namespace TransNet.Domain.Entities;

public class Career : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Type { get; set; } = "Full-time";
    public string Description { get; set; } = string.Empty;
    public string Requirements { get; set; } = string.Empty;
    public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
}
