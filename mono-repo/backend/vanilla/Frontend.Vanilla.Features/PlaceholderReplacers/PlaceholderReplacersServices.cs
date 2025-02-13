using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.PlaceholderReplacers;

internal static class PlaceholderReplacersServices
{
    public static void AddPlaceholderReplacersFeature(this IServiceCollection services)
    {
        services.AddSingleton<IProductPlaceholderReplacer, ProductPlaceholderReplacer>();
    }
}
