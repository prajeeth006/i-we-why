using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.UrlTransformation;

internal static class PrettyUrlsHostServices
{
    public static void AddPrettyUrlsHostFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IPrettyUrlsHostConfiguration, PrettyUrlsHostConfiguration>(PrettyUrlsHostConfiguration.FeatureName);
    }
}
