using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.Redirex;

internal static class RedirexServices
{
    public static void AddRedirexFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IRedirexConfiguration, RedirexConfiguration>(RedirexConfiguration.FeatureName);
        services.AddSingleton<IHealthCheck, RedirexHealthCheck>();
        services.AddSingleton<IRedirexService, RedirexService>();
    }
}
