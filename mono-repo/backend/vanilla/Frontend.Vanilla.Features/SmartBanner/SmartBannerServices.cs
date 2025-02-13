using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.SmartBanner;

internal static class SmartBannerServices
{
    public static void AddSmartBannerFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ISmartBannerConfiguration, SmartBannerConfiguration>(SmartBannerConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, SmartBannerClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, SmartBannerFeatureEnablementProvider>();
    }
}
