using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.AdobeTarget;

internal static class AdobeTargetServices
{
    public static void AddAdobeTargetFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IAdobeTargetConfiguration, AdobeTargetConfiguration>(AdobeTargetConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, AdobeTargetClientConfigProvider>();
    }
}
