using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.InactivityScreen;

internal static class InactivityScreenServices
{
    public static void AddInactivityScreenFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, InactivityScreenClientConfigProvider>();
        services.AddConfiguration<IInactivityScreenConfiguration, InactivityScreenConfiguration>(InactivityScreenConfiguration.FeatureName);
        services.AddSingleton<IFeatureEnablementProvider, InactivityScreenFeatureEnablementProvider>();
    }
}
