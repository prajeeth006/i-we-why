using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.CurrentSession;

internal static class CurrentSessionServices
{
    public static void AddCurrentSessionFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, CurrentSessionClientConfigProvider>();
    }
}
