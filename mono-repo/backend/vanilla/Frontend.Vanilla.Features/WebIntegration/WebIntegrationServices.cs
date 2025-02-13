using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.ServerUtils;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.Features.WebIntegration.Content;
using Frontend.Vanilla.Features.WebIntegration.Core;
using Frontend.Vanilla.Features.WebIntegration.ServiceClients;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.WebIntegration;

internal static class WebIntegrationServices
{
    public static void AddWebIntegrationFeature(this IServiceCollection services)
    {
        services.AddDynaConConfigurationIntegration();
        services.AddCoreCoreIntegration();
        services.AddContentIntegration();
        services.AddServiceClientsIntegration();
        services.AddHttpContextAccessor();
        services.AddSingleton<ICookieHandler, AspNetCoreCookieHandler>();
        services.AddSingleton<IEndpointMetadata, AspNetCoreEndpointMetadata>();
        services.AddSingleton<IEnvironmentNameProvider, EnvironmentNameProviderBase>();
        services.AddSingleton<IServerIPProvider, AspNetCoreServerIpAddress>();
        services.AddSingleton<ISingleDomainAppConfiguration, SingleDomainAppConfiguration>();
        services.AddSingleton<IEnvironmentNameProvider, AspNetHostEnvironmentNameProvider>();
    }
}
