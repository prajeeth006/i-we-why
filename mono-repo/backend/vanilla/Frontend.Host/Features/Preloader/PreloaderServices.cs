using Microsoft.Extensions.DependencyInjection;
using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Host.Features.Preloader;

internal static class PreloaderServices
{
    public static void AddPreloaderFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IPreloaderConfiguration, PreloaderConfiguration>(PreloaderConfiguration.FeatureName);
    }
}
