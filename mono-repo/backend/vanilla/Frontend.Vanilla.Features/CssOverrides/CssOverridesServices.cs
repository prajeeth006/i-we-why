using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.CssOverrides;

internal static class CssOverridesServices
{
    public static void AddCssOverridesFeature(this IServiceCollection services)
    {
        services.AddSingleton<ICssOverridesProvider, CssOverridesProvider>();
        services.AddSingleton<IClientConfigProvider, CssOverridesClientConfigProvider>();
    }
}
