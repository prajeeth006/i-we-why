using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.PlayerActiveWager;

internal static class PlayerActiveWagerServices
{
    public static void AddPlayerActiveWagerFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, PlayerActiveWagerClientConfigProvider>();
    }
}
