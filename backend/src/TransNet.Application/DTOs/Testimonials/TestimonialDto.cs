namespace TransNet.Application.DTOs.Testimonials;

public class TestimonialDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Quote { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public int Rating { get; set; }
    public bool IsPublished { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateTestimonialDto
{
    public string Name { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Quote { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public int Rating { get; set; } = 5;
    public bool IsPublished { get; set; }
}

public class UpdateTestimonialDto
{
    public string Name { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Quote { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public int Rating { get; set; }
    public bool IsPublished { get; set; }
}
