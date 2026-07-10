using TransNet.Domain.Common;
using TransNet.Domain.Enums;

namespace TransNet.Domain.Entities;

public class Project : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid? ServiceId { get; set; }
    public Service? Service { get; set; }
    public ProjectStatus Status { get; set; } = ProjectStatus.Planning;
}
