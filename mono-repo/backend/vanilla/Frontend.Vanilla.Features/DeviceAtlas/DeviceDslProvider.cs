using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.DeviceAtlas;

internal sealed class DeviceDslProvider(IDeviceAtlasService deviceAtlasService, ILogger<DeviceDslProvider> logger) : IDeviceDslProvider
{
    public async Task<string?> GetCapabilityAsync(ExecutionMode mode, string name)
    {
        try
        {
            var properties = await deviceAtlasService.GetAsync(mode);
            return properties.Item2.GetValue(name);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to fetch device properties. Returning empty response.");
            return string.Empty;
        }
    }

    private async Task<bool> GetBoolCapabilityAsync(ExecutionMode mode, string name)
        => await GetCapabilityAsync(mode, name) == "1";

    public Task<bool> IsMobileAsync(ExecutionMode mode) => GetBoolCapabilityAsync(mode, "mobileDevice");
    public Task<bool> IsTouchAsync(ExecutionMode mode) => GetBoolCapabilityAsync(mode, "touchScreen");
    public Task<bool> IsTabletAsync(ExecutionMode mode) => GetBoolCapabilityAsync(mode, "isTablet");
    public Task<bool> IsMobilePhoneAsync(ExecutionMode mode) => GetBoolCapabilityAsync(mode, "isMobilePhone");
    public Task<bool> IsRobotAsync(ExecutionMode mode) => GetBoolCapabilityAsync(mode, "isRobot");
    public Task<bool> IsIOSAsync(ExecutionMode mode) => GetBoolCapabilityAsync(mode, "osiOs");
    public Task<bool> IsAndroidAsync(ExecutionMode mode) => GetBoolCapabilityAsync(mode, "osAndroid");
    public Task<string?> OSNameAsync(ExecutionMode mode) => GetCapabilityAsync(mode, "osName");
    public Task<string?> OSVersionAsync(ExecutionMode mode) => GetCapabilityAsync(mode, "osVersion");
    public Task<string?> ModelAsync(ExecutionMode mode) => GetCapabilityAsync(mode, "model");
    public Task<string?> VendorAsync(ExecutionMode mode) => GetCapabilityAsync(mode, "vendor");
}
