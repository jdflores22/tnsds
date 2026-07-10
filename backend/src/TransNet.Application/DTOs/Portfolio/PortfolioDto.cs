namespace TransNet.Application.DTOs.Portfolio;

public class PortfolioDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Guid? ClientId { get; set; }
    public string? ClientName { get; set; }
    public string LogoUrl { get; set; } = string.Empty;
    public string ImagesJson { get; set; } = "[]";
    public string TechStackJson { get; set; } = "[]";
    public bool IsFeatured { get; set; }
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreatePortfolioDto
{
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Guid? ClientId { get; set; }
    public string LogoUrl { get; set; } = string.Empty;
    public string ImagesJson { get; set; } = "[]";
    public string TechStackJson { get; set; } = "[]";
    public bool IsFeatured { get; set; }
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; }
}

public class UpdatePortfolioDto
{
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Guid? ClientId { get; set; }
    public string LogoUrl { get; set; } = string.Empty;
    public string ImagesJson { get; set; } = "[]";
    public string TechStackJson { get; set; } = "[]";
    public bool IsFeatured { get; set; }
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; }
}
