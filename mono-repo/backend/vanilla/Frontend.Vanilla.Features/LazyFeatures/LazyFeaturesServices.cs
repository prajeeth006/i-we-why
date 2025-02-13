using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.LazyFeatures;

internal static class LazyFeaturesServices
{
    public static void AddLazyFeaturesFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ILazyFeaturesConfiguration, LazyFeaturesConfiguration>(LazyFeaturesConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, LazyFeaturesClientConfigProvider>();
    }
}
