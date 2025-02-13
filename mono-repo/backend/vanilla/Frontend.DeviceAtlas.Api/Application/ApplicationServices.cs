using Vanilla.Extensions.Diagnostics.SiteVersion;

namespace Frontend.DeviceAtlas.Api.Application;

internal static class ApplicationServices
{
    public static void AddApplication(this IServiceCollection services)
    {
        services.AddSingleton<IDeviceAtlasService, DeviceAtlasService>();
        services.AddHostedService<DeviceAtlasDataBackgroundService>();
        services.AddHealthChecks().AddCheck<DeviceAtlasHealthCheck>("DeviceAtlas");
        services.AddSingleton<IDiagnosticVersionProvider, DeviceAtlasDiagnosticVersionProvider>();
    }
}
