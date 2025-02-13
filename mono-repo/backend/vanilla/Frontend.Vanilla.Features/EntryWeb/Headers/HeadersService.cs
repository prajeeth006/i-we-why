using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.EntryWeb.Headers;

internal static class HeadersService
{
    public static void AddHeadersFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IHeadersConfiguration, HeadersConfiguration>(HeadersConfiguration.FeatureName);
    }
}
