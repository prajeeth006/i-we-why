using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Clock;

internal static class ClockServices
{
    public static void AddClockFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IClockConfiguration, ClockConfiguration>(ClockConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, ClockClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, ClockFeatureEnablementProvider>();
    }
}
