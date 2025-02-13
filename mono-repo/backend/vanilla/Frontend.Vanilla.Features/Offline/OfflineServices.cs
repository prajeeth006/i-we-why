using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Offline;

internal static class PwaServices
{
    public static void AddPwaFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IOfflineConfiguration, OfflineConfiguration>(OfflineConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, OfflineClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, OfflineFeatureEnablementProvider>();
    }
}
