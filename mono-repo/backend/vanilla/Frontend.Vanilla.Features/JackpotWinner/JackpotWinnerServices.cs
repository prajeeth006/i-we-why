using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.JackpotWinner;

internal static class JackpotWinnerServices
{
    public static void AddJackpotWinnerFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, JackpotWinnerClientConfigProvider>();
    }
}
