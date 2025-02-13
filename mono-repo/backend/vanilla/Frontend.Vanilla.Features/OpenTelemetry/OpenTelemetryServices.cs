using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.OpenTelemetry;

internal static class OpenTelemetryServices
{
    public static void AddOpenTelemetryFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IOpenTelemetryConfiguration, OpenTelemetryConfiguration>(OpenTelemetryConfiguration.FeatureName);
        services.AddSingleton<OpenTelemetryRequestFilter>();
    }
}
