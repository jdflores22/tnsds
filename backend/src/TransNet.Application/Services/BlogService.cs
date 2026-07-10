using Microsoft.EntityFrameworkCore;
using TransNet.Application.Common;
using TransNet.Application.DTOs.Blogs;
using TransNet.Application.Interfaces;
using TransNet.Domain.Entities;
using TransNet.Domain.Interfaces;

namespace TransNet.Application.Services;

public class BlogService : IBlogService
{
    private readonly IApplicationDbContext _context;

    public BlogService(IApplicationDbContext context) => _context = context;

    public async Task<(List<BlogDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = QueryExtensions.ApplyPublicFilter(_context.Blogs, adminView)
            .Include(b => b.Category)
            .Include(b => b.Author)
            .OrderByDescending(b => b.PublishedAt ?? b.CreatedAt);
        var (items, meta) = await QueryExtensions.ToPagedListAsync(query, page, pageSize, cancellationToken);
        return (items.Select(Map).ToList(), meta);
    }

    public async Task<BlogDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.Blogs, adminView)
            .Include(b => b.Category)
            .Include(b => b.Author)
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<BlogDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.Blogs, false)
            .Include(b => b.Category)
            .Include(b => b.Author)
            .FirstOrDefaultAsync(b => b.Slug == slug, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<BlogDto> CreateAsync(CreateBlogDto dto, Guid? authorId, CancellationToken cancellationToken = default)
    {
        var entity = new Blog
        {
            Title = dto.Title,
            Slug = dto.Slug ?? SlugHelper.Generate(dto.Title),
            Excerpt = dto.Excerpt,
            Content = dto.Content,
            FeaturedImageUrl = dto.FeaturedImageUrl,
            CategoryId = dto.CategoryId,
            AuthorId = authorId,
            PublishedAt = dto.PublishedAt,
            SeoTitle = dto.SeoTitle,
            SeoDescription = dto.SeoDescription,
            IsPublished = dto.IsPublished
        };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<BlogDto?> UpdateAsync(Guid id, UpdateBlogDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Blogs.Include(b => b.Category).Include(b => b.Author)
            .FirstOrDefaultAsync(b => b.Id == id && !b.IsDeleted, cancellationToken);
        if (entity is null) return null;

        entity.Title = dto.Title;
        entity.Slug = dto.Slug ?? SlugHelper.Generate(dto.Title);
        entity.Excerpt = dto.Excerpt;
        entity.Content = dto.Content;
        entity.FeaturedImageUrl = dto.FeaturedImageUrl;
        entity.CategoryId = dto.CategoryId;
        entity.PublishedAt = dto.PublishedAt;
        entity.SeoTitle = dto.SeoTitle;
        entity.SeoDescription = dto.SeoDescription;
        entity.IsPublished = dto.IsPublished;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Blogs.FirstOrDefaultAsync(b => b.Id == id && !b.IsDeleted, cancellationToken);
        if (entity is null) return false;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static BlogDto Map(Blog entity) => new()
    {
        Id = entity.Id,
        Title = entity.Title,
        Slug = entity.Slug,
        Excerpt = entity.Excerpt,
        Content = entity.Content,
        FeaturedImageUrl = entity.FeaturedImageUrl,
        CategoryId = entity.CategoryId,
        CategoryName = entity.Category?.Name,
        AuthorId = entity.AuthorId,
        AuthorName = entity.Author is null ? null : $"{entity.Author.FirstName} {entity.Author.LastName}".Trim(),
        PublishedAt = entity.PublishedAt,
        SeoTitle = entity.SeoTitle,
        SeoDescription = entity.SeoDescription,
        IsPublished = entity.IsPublished,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}

public class BlogCategoryService : IBlogCategoryService
{
    private readonly IApplicationDbContext _context;

    public BlogCategoryService(IApplicationDbContext context) => _context = context;

    public async Task<(List<BlogCategoryDto> Items, ResponseMeta Meta)> GetAllAsync(bool adminView, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = QueryExtensions.ApplyPublicFilter(_context.BlogCategories, adminView).OrderBy(c => c.Name);
        var (items, meta) = await QueryExtensions.ToPagedListAsync(query, page, pageSize, cancellationToken);
        return (items.Select(Map).ToList(), meta);
    }

    public async Task<BlogCategoryDto?> GetByIdAsync(Guid id, bool adminView, CancellationToken cancellationToken = default)
    {
        var entity = await QueryExtensions.ApplyPublicFilter(_context.BlogCategories, adminView)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<BlogCategoryDto> CreateAsync(CreateBlogCategoryDto dto, CancellationToken cancellationToken = default)
    {
        var entity = new BlogCategory
        {
            Name = dto.Name,
            Slug = dto.Slug ?? SlugHelper.Generate(dto.Name),
            IsPublished = dto.IsPublished
        };
        _context.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<BlogCategoryDto?> UpdateAsync(Guid id, UpdateBlogCategoryDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.BlogCategories.FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted, cancellationToken);
        if (entity is null) return null;

        entity.Name = dto.Name;
        entity.Slug = dto.Slug ?? SlugHelper.Generate(dto.Name);
        entity.IsPublished = dto.IsPublished;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.BlogCategories.FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted, cancellationToken);
        if (entity is null) return false;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static BlogCategoryDto Map(BlogCategory entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        Slug = entity.Slug,
        IsPublished = entity.IsPublished,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
