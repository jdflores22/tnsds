using TransNet.Domain.Enums;

namespace TransNet.Application.DTOs.Careers;

public class JobApplicationDto
{
    public Guid Id { get; set; }
    public Guid CareerId { get; set; }
    public string CareerTitle { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string CoverLetter { get; set; } = string.Empty;
    public string ResumeUrl { get; set; } = string.Empty;
    public ApplicationStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateJobApplicationDto
{
    public Guid CareerId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string CoverLetter { get; set; } = string.Empty;
    public string ResumeUrl { get; set; } = string.Empty;
}

public class UpdateJobApplicationDto
{
    public ApplicationStatus Status { get; set; }
}
