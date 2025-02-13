using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.PlayerLimits;

internal static class PlayerLimitsServices
{
    public static void AddPlayerLimitsFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IPlayerLimitsConfiguration, PlayerLimitsConfiguration>(PlayerLimitsConfiguration.FeatureName);
        services.AddSingleton<IFeatureEnablementProvider, PlayerLimitsFeatureEnablementProvider>();
    }
}
