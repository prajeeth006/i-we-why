using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.NativeApp;

internal static class NativeAppServices
{
    public static void AddNativeAppFeatureBase(this IServiceCollection services)
    {
        services.AddConfiguration<INativeAppConfiguration, NativeAppConfiguration>(NativeAppConfiguration.FeatureName);
        services.AddSingleton<INativeAppService, NativeAppService>();
    }

    public static void AddNativeAppFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, NativeAppClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, NativeAppFeatureEnablementProvider>();
    }
}
