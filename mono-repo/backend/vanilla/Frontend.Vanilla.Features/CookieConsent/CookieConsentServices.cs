using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.CookieConsent;

internal static class CookieConsentServices
{
    public static void AddCookieConsentFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ICookieConsentConfiguration, CookieConsentConfiguration>(CookieConsentConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, CookieConsentClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, CookieConsentFeatureEnablementProvider>();
    }
}
