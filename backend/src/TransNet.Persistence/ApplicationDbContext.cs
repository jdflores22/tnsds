using Microsoft.EntityFrameworkCore;
using TransNet.Domain.Entities;
using TransNet.Domain.Interfaces;

namespace TransNet.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Portfolio> Portfolios => Set<Portfolio>();
    public DbSet<SoftwareProduct> SoftwareProducts => Set<SoftwareProduct>();
    public DbSet<Industry> Industries => Set<Industry>();
    public DbSet<FaqItem> FaqItems => Set<FaqItem>();
    public DbSet<SiteStat> SiteStats => Set<SiteStat>();
    public DbSet<CompanyHighlight> CompanyHighlights => Set<CompanyHighlight>();
    public DbSet<ProcessStep> ProcessSteps => Set<ProcessStep>();
    public DbSet<Technology> Technologies => Set<Technology>();
    public DbSet<BlogCategory> BlogCategories => Set<BlogCategory>();
    public DbSet<Blog> Blogs => Set<Blog>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<Subscriber> Subscribers => Set<Subscriber>();
    public DbSet<Career> Careers => Set<Career>();
    public DbSet<JobApplication> JobApplications => Set<JobApplication>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<SeoSetting> SeoSettings => Set<SeoSetting>();
    public DbSet<ActivityLog> ActivityLogs => Set<ActivityLog>();

    IQueryable<User> IApplicationDbContext.Users => Users;
    IQueryable<Role> IApplicationDbContext.Roles => Roles;
    IQueryable<Permission> IApplicationDbContext.Permissions => Permissions;
    IQueryable<RolePermission> IApplicationDbContext.RolePermissions => RolePermissions;
    IQueryable<Service> IApplicationDbContext.Services => Services;
    IQueryable<Project> IApplicationDbContext.Projects => Projects;
    IQueryable<Client> IApplicationDbContext.Clients => Clients;
    IQueryable<Portfolio> IApplicationDbContext.Portfolios => Portfolios;
    IQueryable<SoftwareProduct> IApplicationDbContext.SoftwareProducts => SoftwareProducts;
    IQueryable<Industry> IApplicationDbContext.Industries => Industries;
    IQueryable<FaqItem> IApplicationDbContext.FaqItems => FaqItems;
    IQueryable<SiteStat> IApplicationDbContext.SiteStats => SiteStats;
    IQueryable<CompanyHighlight> IApplicationDbContext.CompanyHighlights => CompanyHighlights;
    IQueryable<ProcessStep> IApplicationDbContext.ProcessSteps => ProcessSteps;
    IQueryable<Technology> IApplicationDbContext.Technologies => Technologies;
    IQueryable<BlogCategory> IApplicationDbContext.BlogCategories => BlogCategories;
    IQueryable<Blog> IApplicationDbContext.Blogs => Blogs;
    IQueryable<Testimonial> IApplicationDbContext.Testimonials => Testimonials;
    IQueryable<ContactMessage> IApplicationDbContext.ContactMessages => ContactMessages;
    IQueryable<Subscriber> IApplicationDbContext.Subscribers => Subscribers;
    IQueryable<Career> IApplicationDbContext.Careers => Careers;
    IQueryable<JobApplication> IApplicationDbContext.JobApplications => JobApplications;
    IQueryable<SiteSetting> IApplicationDbContext.SiteSettings => SiteSettings;
    IQueryable<SeoSetting> IApplicationDbContext.SeoSettings => SeoSettings;
    IQueryable<ActivityLog> IApplicationDbContext.ActivityLogs => ActivityLogs;

    public new void Add<T>(T entity) where T : class => Set<T>().Add(entity);
    public new void Update<T>(T entity) where T : class => Set<T>().Update(entity);
    public new void Remove<T>(T entity) where T : class => Set<T>().Remove(entity);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RolePermission>().HasKey(rp => new { rp.RoleId, rp.PermissionId });
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<Service>().HasIndex(s => s.Slug).IsUnique();
        modelBuilder.Entity<Portfolio>().HasIndex(p => p.Slug).IsUnique();
        modelBuilder.Entity<SoftwareProduct>().HasIndex(p => p.Slug).IsUnique();
        modelBuilder.Entity<Industry>().HasIndex(i => i.Slug).IsUnique();
        modelBuilder.Entity<Blog>().HasIndex(b => b.Slug).IsUnique();
        modelBuilder.Entity<BlogCategory>().HasIndex(c => c.Slug).IsUnique();
        modelBuilder.Entity<Career>().HasIndex(c => c.Slug).IsUnique();
        modelBuilder.Entity<SiteSetting>().HasIndex(s => s.Key).IsUnique();
        modelBuilder.Entity<SeoSetting>().HasIndex(s => s.PageKey).IsUnique();
        modelBuilder.Entity<Subscriber>().HasIndex(s => s.Email).IsUnique();

        modelBuilder.Entity<RolePermission>()
            .HasOne(rp => rp.Role).WithMany(r => r.RolePermissions).HasForeignKey(rp => rp.RoleId);
        modelBuilder.Entity<RolePermission>()
            .HasOne(rp => rp.Permission).WithMany(p => p.RolePermissions).HasForeignKey(rp => rp.PermissionId);
    }
}
