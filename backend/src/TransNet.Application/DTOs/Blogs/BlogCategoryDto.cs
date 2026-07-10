namespace TransNet.Application.DTOs.Blogs;

public class BlogCategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public bool IsPublished { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateBlogCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public bool IsPublished { get; set; }
}

public class UpdateBlogCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public bool IsPublished { get; set; }
}
