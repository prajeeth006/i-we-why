using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.WebUtilities;

internal static class WebUtilitiesServices
{
    public static void AddWebUtilitiesFeature(this IServiceCollection services)
    {
        services.AddSingleton<IBrowserUrlProvider, BrowserUrlProvider>();
    }
}
