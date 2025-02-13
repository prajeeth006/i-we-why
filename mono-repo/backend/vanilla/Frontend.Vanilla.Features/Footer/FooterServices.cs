using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Footer;

internal static class FooterServices
{
    public static void AddFooterFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IFooterConfiguration, FooterConfiguration>(FooterConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, FooterClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, FooterFeatureEnablementProvider>();
    }
}
