using TransNet.Domain.Enums;

namespace TransNet.Application.DTOs.Projects;

public class ProjectDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid? ServiceId { get; set; }
    public string? ServiceTitle { get; set; }
    public ProjectStatus Status { get; set; }
    public bool IsPublished { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateProjectDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid? ServiceId { get; set; }
    public ProjectStatus Status { get; set; } = ProjectStatus.Planning;
    public bool IsPublished { get; set; }
}

public class UpdateProjectDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid? ServiceId { get; set; }
    public ProjectStatus Status { get; set; }
    public bool IsPublished { get; set; }
}
