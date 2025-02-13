using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.BalanceProperties;

internal static class BalancePropertiesService
{
    public static void AddBalancePropertiesFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, BalancePropertiesClientConfigProvider>();
    }
}
