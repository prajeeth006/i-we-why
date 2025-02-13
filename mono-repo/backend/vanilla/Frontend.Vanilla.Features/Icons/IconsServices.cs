using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Icons;

internal static class IconsServices
{
    public static void AddIconsFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, IconsClientConfigProvider>();
        services.AddSingleton<IClientConfigProvider, IconsClientConfigProviderOld>();
    }
}
