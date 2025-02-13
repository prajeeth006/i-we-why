using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

namespace Frontend.Vanilla.Features.DynaConVariationContext.Providers;

/// <summary>
/// Provides device type from DeviceAtlas for config variation context.
/// </summary>
internal sealed class DeviceTypeDynaConProvider(IDeviceDslProvider deviceDslProvider) : IWebDynaConVariationContextProvider
{
    public TrimmedRequiredString Name { get; } = "DeviceType";
    public TrimmedRequiredString DefaultValue { get; } = DeviceTypes.Phone; // Mobile first design

    public string GetCurrentRawValue()
    {
        if (!deviceDslProvider.IsMobileAsync(ExecutionMode.Sync).Result)
            return DeviceTypes.Desktop;

        return deviceDslProvider.IsTabletAsync(ExecutionMode.Sync).Result ? DeviceTypes.Tablet : DeviceTypes.Phone;
    }
}

internal static class DeviceTypes
{
    public const string Desktop = "desktop";
    public const string Phone = "phone";
    public const string Tablet = "tablet";
}
