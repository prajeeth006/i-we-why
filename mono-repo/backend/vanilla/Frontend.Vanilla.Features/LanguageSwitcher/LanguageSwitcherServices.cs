using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.LanguageSwitcher;

internal static class LanguageSwitcherServices
{
    public static void AddLanguageSwitcherFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ILanguageSwitcherConfiguration, LanguageSwitcherConfiguration>(LanguageSwitcherConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, LanguageSwitcherClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, LanguageSwitcherFeatureEnablementProvider>();
    }
}
