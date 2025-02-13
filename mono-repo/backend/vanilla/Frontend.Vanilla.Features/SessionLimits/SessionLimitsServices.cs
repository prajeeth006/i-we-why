using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.SessionLimits;

internal static class SessionLimitsServices
{
    public static void AddSessionLimitsFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ISessionLimitsConfiguration, SessionLimitsConfiguration>(SessionLimitsConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, SessionLimitsClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, SessionLimitsFeatureEnablementProvider>();
    }
}
