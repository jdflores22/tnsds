using Microsoft.Extensions.DependencyInjection;
using TransNet.Application.Interfaces;
using TransNet.Application.Services;

namespace TransNet.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IServiceService, ServiceService>();
        services.AddScoped<ITechnologyService, TechnologyService>();
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<IIndustryService, IndustryService>();
        services.AddScoped<IFaqService, FaqService>();
        services.AddScoped<ISiteStatService, SiteStatService>();
        services.AddScoped<ICompanyHighlightService, CompanyHighlightService>();
        services.AddScoped<IProcessStepService, ProcessStepService>();
        services.AddScoped<IPortfolioService, PortfolioService>();
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<IClientService, ClientService>();
        services.AddScoped<IBlogService, BlogService>();
        services.AddScoped<IBlogCategoryService, BlogCategoryService>();
        services.AddScoped<ITestimonialService, TestimonialService>();
        services.AddScoped<IContactMessageService, ContactMessageService>();
        services.AddScoped<ICareerService, CareerService>();
        services.AddScoped<IJobApplicationService, JobApplicationService>();
        services.AddScoped<ISubscriberService, SubscriberService>();
        services.AddScoped<ISiteSettingService, SiteSettingService>();
        services.AddScoped<ISeoSettingService, SeoSettingService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IActivityLogService, ActivityLogService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IRoleService, RoleService>();

        return services;
    }
}
