using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.RedirectMessage;

internal static class RedirectMessageServices
{
    public static void AddRedirectMessageFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IRedirectMessageConfiguration, RedirectMessageConfiguration>(RedirectMessageConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, RedirectMessageClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, RedirectMessageFeatureEnablementProvider>();
    }
}
