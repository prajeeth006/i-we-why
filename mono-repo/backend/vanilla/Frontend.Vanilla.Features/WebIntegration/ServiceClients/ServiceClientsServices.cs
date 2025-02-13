using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.ServiceClients.Infrastructure.Caching;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Security.Claims;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.WebIntegration.ServiceClients;

internal static class ServiceClientsServices
{
    public static void AddServiceClientsIntegration(this IServiceCollection services)
    {
        services.AddSingleton<IClaimsCacheTime, WebClaimsCacheTime>();
        services.AddSingleton<IPosApiCacheDiagnostics>(p => p.Create<WebPosApiCacheDiagnostics>(p.Create<PosApiCacheDiagnostics>()));
        services.AddSingleton<ICurrentUserAccessor, WebCurrentUserAccessor>();
    }
}
