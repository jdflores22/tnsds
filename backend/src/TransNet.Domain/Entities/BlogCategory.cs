using TransNet.Domain.Common;

namespace TransNet.Domain.Entities;

public class BlogCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public ICollection<Blog> Blogs { get; set; } = new List<Blog>();
}
