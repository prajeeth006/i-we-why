using Frontend.Vanilla.Core.Configuration;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.StaticFiles;

internal static class StaticFilesServices
{
    public static void AddStaticFilesFeature(this IServiceCollection services)
    {
        services.AddSingleton<IContentTypeProvider, FileExtensionContentTypeProvider>();
        services.AddConfiguration<IStaticFilesConfiguration, StaticFilesConfiguration>(StaticFilesConfiguration.FeatureName);
        services.AddSingleton<IStaticFilesPhysicalFileProvider, StaticFilesPhysicalFileProvider>();
    }
}
