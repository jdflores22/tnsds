namespace TransNet.Application.DTOs.Products;

public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string FeaturesJson { get; set; } = "[]";
    public string ScreenshotsJson { get; set; } = "[]";
    public string LogoUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; }
    public bool IsFeatured { get; set; }
    public int HomepageRow { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string ShortDescription { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string FeaturesJson { get; set; } = "[]";
    public string ScreenshotsJson { get; set; } = "[]";
    public string LogoUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; }
    public bool IsFeatured { get; set; }
    public int HomepageRow { get; set; } = 1;
}

public class UpdateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string ShortDescription { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string FeaturesJson { get; set; } = "[]";
    public string ScreenshotsJson { get; set; } = "[]";
    public string LogoUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; }
    public bool IsFeatured { get; set; }
    public int HomepageRow { get; set; } = 1;
}
