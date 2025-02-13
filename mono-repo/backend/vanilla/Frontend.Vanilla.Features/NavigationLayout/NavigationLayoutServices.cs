using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.NavigationLayout;

internal static class NavigationLayoutServices
{
    public static void AddNavigationLayoutFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, NavigationLayoutClientConfigProvider>();
    }
}
