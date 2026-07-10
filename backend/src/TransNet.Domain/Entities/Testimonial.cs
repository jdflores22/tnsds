using TransNet.Domain.Common;

namespace TransNet.Domain.Entities;

public class Testimonial : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Quote { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public int Rating { get; set; } = 5;
}
