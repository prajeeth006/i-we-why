using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.StatusCode;

internal static class StatusCodeService
{
    public static void AddStatusCodeFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IStatusCodeConfiguration, StatusCodeConfiguration>(StatusCodeConfiguration.FeatureName);
    }
}
