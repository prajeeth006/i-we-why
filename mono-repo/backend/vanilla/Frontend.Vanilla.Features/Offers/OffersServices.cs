using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Offers;

internal static class OffersServices
{
    public static void AddOffersFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IOffersConfiguration, OffersConfiguration>(OffersConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, OffersClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, OffersFeatureEnablementProvider>();
    }
}
