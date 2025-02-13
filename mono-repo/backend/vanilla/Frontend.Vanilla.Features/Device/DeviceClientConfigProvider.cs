using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.DeviceAtlas;

namespace Frontend.Vanilla.Features.Device;

internal sealed class DeviceClientConfigProvider(IDeviceDslProvider deviceDslProvider, IDeviceAtlasService deviceAtlasService, IDeviceLoggingConfiguration deviceLoggingConfiguration)
    : LambdaClientConfigProvider("vnDevice", async ct =>
    {
        var mode = ExecutionMode.Async(ct);
        var result = await deviceAtlasService.GetAsync(mode);
        return new
        {
            IsAndroid = await deviceDslProvider.IsAndroidAsync(mode),
            IsIOS = await deviceDslProvider.IsIOSAsync(mode),
            IsMobile = await deviceDslProvider.IsMobileAsync(mode),
            IsTouch = await deviceDslProvider.IsTouchAsync(mode),
            IsMobilePhone = await deviceDslProvider.IsMobilePhoneAsync(mode),
            IsTablet = await deviceDslProvider.IsTabletAsync(mode),
            IsRobot = await deviceDslProvider.IsRobotAsync(mode),
            Model = await deviceDslProvider.ModelAsync(mode),
            OSName = await deviceDslProvider.OSNameAsync(mode),
            OSVersion = await deviceDslProvider.OSVersionAsync(mode),
            Vendor = await deviceDslProvider.VendorAsync(mode),
            cpuMaxFrequency = await deviceDslProvider.GetCapabilityAsync(mode, "cpuMaxFrequency"),
            totalRam = await deviceDslProvider.GetCapabilityAsync(mode, "totalRam"),
            cpuCores = await deviceDslProvider.GetCapabilityAsync(mode, "cpuCores"),
            displayWidth = await deviceDslProvider.GetCapabilityAsync(mode, "displayWidth"),
            displayHeight = await deviceDslProvider.GetCapabilityAsync(mode, "displayHeight"),
            logInfoEnabled = deviceLoggingConfiguration.IsEnabled,
            Properties = result.Item2,
        };
    }) { }
