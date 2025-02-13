using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Inactive;

internal static class InactiveServices
{
    public static void AddInactiveFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IInactiveConfiguration, InactiveConfiguration>(InactiveConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, InactiveClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, InactiveFeatureEnablementProvider>();
    }
}
