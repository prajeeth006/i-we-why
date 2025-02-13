using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.PlayerAttributes;

internal static class PlayerAttributesServices
{
    public static void AddPlayerAttributesFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IPlayerAttributesConfiguration, PlayerAttributesConfiguration>(PlayerAttributesConfiguration.FeatureName);
        services.AddSingleton<IFeatureEnablementProvider, PlayerAttributesFeatureEnablementProvider>();
    }
}
