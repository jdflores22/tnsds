using Microsoft.EntityFrameworkCore;
using TransNet.Application.Common;
using TransNet.Application.DTOs.ProcessSteps;
using TransNet.Application.Interfaces;
using TransNet.Domain.Entities;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public class ProcessStepService : IProcessStepService
{
    private readonly IApplicationDbContext _context;

    public ProcessStepService(IApplicationDbContext context) => _context = context;

    public async Task<(List<ProcessStepDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 50, CancellationToken cancellationToken = default)
    {
        var query = QueryExtensions.ApplyPublicFilter(_context.ProcessSteps, adminView).OrderBy(p => p.SortOrder);
        var (items, meta) = await QueryExtensions.ToPagedListAsync(query, page, pageSize, cancellationToken);
        return (items.Select(Map).ToList(), meta);
    }

    public async Task<ProcessStepDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.ProcessSteps, adminView)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<ProcessStepDto> CreateAsync(CreateProcessStepDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new ProcessStep
        {
            StepLabel = dto.StepLabel,
            Title = dto.Title,
            Description = dto.Description,
            SortOrder = dto.SortOrder,
            IsPublished = dto.IsPublished
        };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<ProcessStepDto?> UpdateAsync(Guid id, UpdateProcessStepDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.ProcessSteps.FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, cancellationToken);
        if (entity is null) return null;

        entity.StepLabel = dto.StepLabel;
        entity.Title = dto.Title;
        entity.Description = dto.Description;
        entity.SortOrder = dto.SortOrder;
        entity.IsPublished = dto.IsPublished;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.ProcessSteps.FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, cancellationToken);
        if (entity is null) return false;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static ProcessStepDto Map(ProcessStep entity) => new()
    {
        Id = entity.Id,
        StepLabel = entity.StepLabel,
        Title = entity.Title,
        Description = entity.Description,
        SortOrder = entity.SortOrder,
        IsPublished = entity.IsPublished,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
