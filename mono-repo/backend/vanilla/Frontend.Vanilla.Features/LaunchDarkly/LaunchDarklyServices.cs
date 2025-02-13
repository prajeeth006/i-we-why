using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LaunchDarkly;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.LoginDuration;

internal static class LaunchDarklyServices
{
    public static void AddLaunchDarklyFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, LaunchDarklyClientConfigProvider>();
        services.AddConfiguration<ILaunchDarklyConfiguration, LaunchDarklyConfiguration>(LaunchDarklyConfiguration.FeatureName);
    }
}
