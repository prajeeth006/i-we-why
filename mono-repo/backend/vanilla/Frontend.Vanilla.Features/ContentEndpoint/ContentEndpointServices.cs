using Frontend.Vanilla.Content.Client;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Frontend.Vanilla.Features.ContentEndpoint;

internal static class ContentEndpointServices
{
    public static void AddContentEndpointFeature(this IServiceCollection services)
    {
        services.AddSingleton<IContentEndpointService, ContentEndpointService>();
        services.AddOptions<ContentEndpointOptions>()
            .Configure<IVanillaClientContentService>((o, ccs) => o.ClientContentService = ccs)
            .ValidateDataAnnotations();
        services.AddSingleton<IConfigureOptions<ContentEndpointOptions>, ContentEndpointOptionsBootstrapper>();
    }
}
