using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.DebounceButtons;

internal static class DebounceButtonsServices
{
    public static void AddDebounceButtonsFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IDebounceButtonsConfiguration, DebounceButtonsConfiguration>(DebounceButtonsConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, DebounceButtonsClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, DebounceButtonsFeatureEnablementProvider>();
    }
}
