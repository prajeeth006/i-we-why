using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.SeoTracking;

internal static class SeoTrackingServices
{
    public static void AddEntryWebSeoTrackingFeature(this IServiceCollection services)
    {
        services.AddSingleton<ISeoTrackingCookies, SeoTrackingCookies>();
        services.AddConfigurationWithFactory<ISeoTrackingConfiguration, SeoTrackingConfigurationDto, SeoTrackingConfigurationFactory>(
            SeoTrackingConfiguration.FeatureName);
    }
}
