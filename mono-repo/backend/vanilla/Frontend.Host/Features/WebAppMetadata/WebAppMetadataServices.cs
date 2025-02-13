using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.WebAppMetadata;

internal static class WebAppMetadataServices
{
    public static void AddWebAppMetadataFeature(this IServiceCollection services)
    {
        services.AddSingleton<IWebAppMetadataRenderer, WebAppMetadataRenderer>();
    }
}
