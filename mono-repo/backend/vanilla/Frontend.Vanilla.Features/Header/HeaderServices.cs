using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Header;

internal static class HeaderServices
{
    public static void AddHeaderFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IHeaderConfiguration, HeaderConfiguration>(HeaderConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, HeaderClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, HeaderFeatureEnablementProvider>();
    }
}
