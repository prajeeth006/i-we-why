using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.OfflinePage;

internal static class OfflinePageServices
{
    public static void AddOfflinePageFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IOfflinePageConfiguration, OfflinePageConfiguration>(OfflinePageConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, OfflinePageClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, OfflinePageFeatureEnablementProvider>();
    }
}
