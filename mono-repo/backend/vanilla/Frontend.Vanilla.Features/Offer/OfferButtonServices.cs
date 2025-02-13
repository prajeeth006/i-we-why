using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Offer;

internal static class OfferButtonServices
{
    public static void AddOfferFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, OfferButtonClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, OfferButtonFeatureEnablementProvider>();
    }
}
