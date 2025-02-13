using System;
using Frontend.Vanilla.Core.DependencyInjection.Decorator;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.DeviceAtlas;

internal static class DeviceAtlasServices
{
    public static void AddDeviceAtlasFeature(this IServiceCollection services)
    {
        services.AddSingleton<IDeviceAtlasConfiguration, DeviceAtlasConfiguration>();
        services.AddSingleton<IDiagnosticInfoProvider, DeviceCapabilitiesDiagnosticProvider>();
        services.AddSingletonWithDecorators<IDeviceAtlasService, DeviceAtlasService>(
            b => b.DecorateBy<CachedDeviceAtlasService>());
        services.AddSingleton<IHealthCheck, DeviceAtlasHealthCheck>();
        services.AddSingleton<IDeviceAtlasHeadersFilter, DeviceAtlasHeadersFilter>();
        services.AddScoped<DeviceAtlasHeadersForwardingHandler>();
        services.AddHttpClient(DeviceAtlasService.HttpClientName)
            .AddHttpMessageHandler<DeviceAtlasHeadersForwardingHandler>()
            .ConfigureHttpClient((serviceProvider, client) =>
            {
                var config = serviceProvider.GetRequiredService<IDeviceAtlasConfiguration>();
                client.BaseAddress = config.Host;
                client.Timeout = TimeSpan.FromSeconds(2);
            });
    }
}
