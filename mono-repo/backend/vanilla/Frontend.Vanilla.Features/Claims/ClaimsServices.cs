using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Claims;

internal static class ClaimsServices
{
    public static void AddClaimsFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, ClaimsClientConfigProvider>();
    }
}
