using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.SiteRootFiles;

internal static class SiteRootServices
{
    public static void AddSiteRootFilesFeature(this IServiceCollection services)
    {
        services.AddSingleton<ISiteRootFileResolver, SiteRootFileResolver>();
    }
}
