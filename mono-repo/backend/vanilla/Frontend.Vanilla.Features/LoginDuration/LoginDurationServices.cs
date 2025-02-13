using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.LoginDuration;

internal static class LoginDurationServices
{
    public static void AddLoginDurationFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, LoginDurationClientConfigProvider>();
        services.AddSingleton<ILoginDurationProvider, LoginDurationProvider>();
        services.AddSingleton<ILoginExpirationProvider, LoginExpirationProvider>();
        services.AddConfiguration<ILoginDurationConfiguration, LoginDurationConfiguration>(LoginDurationConfiguration.FeatureName);
        services.AddSingleton<IFeatureEnablementProvider, LoginDurationFeatureEnablementProvider>();
    }
}
