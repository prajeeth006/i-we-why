using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.LossLimits;

internal static class LossLimitsServices
{
    public static void AddLossLimitsFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ILossLimitsConfiguration, LossLimitsConfiguration>(LossLimitsConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, LossLimitsClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, LossLimitsFeatureEnablementProvider>();
    }
}
