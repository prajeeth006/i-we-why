using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.Geolocation.Config;
using Frontend.Vanilla.Features.Geolocation.Dsl;
using Frontend.Vanilla.Features.Geolocation.PosApi;
using Frontend.Vanilla.Features.LazyFeatures;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Geolocation;

internal static class GeolocationServices
{
    public static void AddGeolocationFeature(this IServiceCollection services)
    {
        // Main API
        services.AddSingleton<IGeolocationService, GeolocationService>();

        // Config
        services.AddConfiguration<IGeolocationConfiguration, GeolocationConfiguration>(GeolocationConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, GeolocationClientConfigProvider>();

        // DSL
        services.AddSingleton<IGeolocationDslProvider, GeolocationDslProvider>();
        services.AddSingleton<IGeolocationDslResolver, GeolocationDslResolver>();

        // PosAPI
        services.AddSingleton<IPosApiRestRequestBuilder, GeolocationPosApiRestRequestBuilder>();
        services.AddSingleton<ILoginFilter, GeolocationLoginFilter>();

        services.AddSingleton<IFeatureEnablementProvider, GeolocationFeatureEnablementProvider>();
    }
}
