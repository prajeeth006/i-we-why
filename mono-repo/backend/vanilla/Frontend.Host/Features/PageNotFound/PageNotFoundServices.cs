using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.PageNotFound;

internal static class PageNotFoundServices
{
    public static void AddPageNotFoundFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IPageNotFoundConfiguration, PageNotFoundConfiguration>(PageNotFoundConfiguration.FeatureName);
    }
}
