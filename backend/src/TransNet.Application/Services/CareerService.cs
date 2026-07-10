using Microsoft.EntityFrameworkCore;
using TransNet.Application.Common;
using TransNet.Application.DTOs.Careers;
using TransNet.Application.Interfaces;
using TransNet.Domain.Entities;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public class CareerService : ICareerService
{
    private readonly IApplicationDbContext _context;

    public CareerService(IApplicationDbContext context) => _context = context;

    public async Task<(List<CareerDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = QueryExtensions.ApplyPublicFilter(_context.Careers, adminView).OrderByDescending(c => c.CreatedAt);
        var (items, meta) = await QueryExtensions.ToPagedListAsync(query, page, pageSize, cancellationToken);
        return (items.Select(Map).ToList(), meta);
    }

    public async Task<CareerDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.Careers, adminView)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<CareerDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.Careers, false)
            .FirstOrDefaultAsync(c => c.Slug == slug, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<CareerDto> CreateAsync(CreateCareerDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new Career
        {
            Title = dto.Title,
            Slug = dto.Slug ?? SlugHelper.Generate(dto.Title),
            Department = dto.Department,
            Location = dto.Location,
            Type = dto.Type,
            Description = dto.Description,
            Requirements = dto.Requirements,
            IsPublished = dto.IsPublished
        };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<CareerDto?> UpdateAsync(Guid id, UpdateCareerDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Careers.FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted, cancellationToken);
        if (entity is null) return null;

        entity.Title = dto.Title;
        entity.Slug = dto.Slug ?? SlugHelper.Generate(dto.Title);
        entity.Department = dto.Department;
        entity.Location = dto.Location;
        entity.Type = dto.Type;
        entity.Description = dto.Description;
        entity.Requirements = dto.Requirements;
        entity.IsPublished = dto.IsPublished;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Careers.FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted, cancellationToken);
        if (entity is null) return false;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static CareerDto Map(Career entity) => new()
    {
        Id = entity.Id,
        Title = entity.Title,
        Slug = entity.Slug,
        Department = entity.Department,
        Location = entity.Location,
        Type = entity.Type,
        Description = entity.Description,
        Requirements = entity.Requirements,
        IsPublished = entity.IsPublished,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}

public class JobApplicationService : IJobApplicationService
{
    private readonly IApplicationDbContext _context;

    public JobApplicationService(IApplicationDbContext context) => _context = context;

    public async Task<(List<JobApplicationDto> Items, ResponseMeta Meta)> GetAllAsync(int page = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = _context.JobApplications.Include(j => j.Career).OrderByDescending(j => j.CreatedAt);
        var (items, meta) = await QueryExtensions.ToPagedListAsync(query, page, pageSize, cancellationToken);
        return (items.Select(Map).ToList(), meta);
    }

    public async Task<JobApplicationDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.JobApplications.Include(j => j.Career)
            .FirstOrDefaultAsync(j => j.Id == id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<JobApplicationDto> CreateAsync(CreateJobApplicationDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new JobApplication
        {
            CareerId = dto.CareerId,
            FullName = dto.FullName,
            Email = dto.Email,
            Phone = dto.Phone,
            CoverLetter = dto.CoverLetter,
            ResumeUrl = dto.ResumeUrl
        };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        var career = await _context.Careers.FirstOrDefaultAsync(c => c.Id == dto.CareerId, cancellationToken);
        entity.Career = career!;
        return Map(entity);
    }

    public async Task<JobApplicationDto?> UpdateAsync(Guid id, UpdateJobApplicationDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.JobApplications.Include(j => j.Career)
            .FirstOrDefaultAsync(j => j.Id == id, cancellationToken);
        if (entity is null) return null;

        entity.Status = dto.Status;
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.JobApplications.FirstOrDefaultAsync(j => j.Id == id, cancellationToken);
        if (entity is null) return false;

        _context.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static JobApplicationDto Map(JobApplication entity) => new()
    {
        Id = entity.Id,
        CareerId = entity.CareerId,
        CareerTitle = entity.Career?.Title ?? string.Empty,
        FullName = entity.FullName,
        Email = entity.Email,
        Phone = entity.Phone,
        CoverLetter = entity.CoverLetter,
        ResumeUrl = entity.ResumeUrl,
        Status = entity.Status,
        CreatedAt = entity.CreatedAt
    };
}
