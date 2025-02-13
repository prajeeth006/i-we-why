using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.Device;

internal interface IDeviceLoggingConfiguration : IDisableableConfiguration { }

internal sealed class DeviceLoggingConfiguration : IDeviceLoggingConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.DeviceInfoLogging";
    public bool IsEnabled { get; set; }
}
