using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.TrackerId;

internal static class TrackerIdServices
{
    public static void AddTrackerIdFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ITrackerIdConfiguration, TrackerIdConfiguration>(TrackerIdConfiguration.FeatureName);
        services.AddSingleton<ISignUpBonusResolver, SignUpBonusResolver>();
        services.AddSingleton<ITrackerIdQueryParameter, TrackerIdQueryParameter>();
        services.AddSingleton<ITrackerIdResolver, TrackerIdResolver>();
    }

    public static void AddTrackerIdFeatureSfapi(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, TrackerIdClientConfigProvider>();
    }
}
