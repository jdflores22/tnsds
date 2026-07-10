using TransNet.Domain.Common;

namespace TransNet.Domain.Entities;

public class Portfolio : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Guid? ClientId { get; set; }
    public Client? Client { get; set; }
    public string LogoUrl { get; set; } = string.Empty;
    public string ImagesJson { get; set; } = "[]";
    public string TechStackJson { get; set; } = "[]";
    public bool IsFeatured { get; set; }
    public int SortOrder { get; set; }
}
