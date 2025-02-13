using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Device;

internal static class DeviceServices
{
    public static void AddDeviceFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, DeviceClientConfigProvider>();
        services.AddConfiguration<IDeviceLoggingConfiguration, DeviceLoggingConfiguration>(DeviceLoggingConfiguration.FeatureName);
    }
}
