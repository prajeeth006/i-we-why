using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.LastKnownProduct;

internal static class LastKnownProductServices
{
    public static void AddLastKnownProductFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, LastKnownProductClientConfigProvider>();
        services.AddConfiguration<ILastKnownProductConfiguration, LastKnownProductConfiguration>(LastKnownProductConfiguration.FeatureName);
    }
}
