namespace TransNet.Application.DTOs.Subscribers;

public class SubscriberDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public DateTime SubscribedAt { get; set; }
    public bool IsActive { get; set; }
}

public class CreateSubscriberDto
{
    public string Email { get; set; } = string.Empty;
}
