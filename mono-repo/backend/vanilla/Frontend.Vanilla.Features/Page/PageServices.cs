using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Page;

internal static class PageServices
{
    public static void AddPageFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, PageClientConfigProvider>();
    }
}
