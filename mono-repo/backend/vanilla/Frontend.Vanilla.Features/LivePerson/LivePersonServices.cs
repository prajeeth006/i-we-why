using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.LivePerson;

internal static class LivePersonServices
{
    public static void AddLivePersonFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, LivePersonClientConfigProvider>();
        services.AddConfiguration<ILivePersonConfiguration, LivePersonConfiguration>(LivePersonConfiguration.FeatureName);
        services.AddSingleton<IFeatureEnablementProvider, LivePersonFeatureEnablementProvider>();
    }
}
