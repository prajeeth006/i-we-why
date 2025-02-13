using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.BottomNav;

internal static class BottomNavServices
{
    public static void AddBottomNavFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IBottomNavConfiguration, BottomNavConfiguration>(BottomNavConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, BottomNavClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, BottomNavFeatureEnablementProvider>();
    }
}
