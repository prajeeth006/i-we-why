using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.DeviceAtlas;

namespace Frontend.Vanilla.Features.DynaConVariationContext.Providers;

/// <summary>
/// Provides device OS name from DeviceAtlas for config variation context.
/// </summary>
internal sealed class OperatingSystemDynaConProvider(IDeviceAtlasService deviceAtlasService) : IWebDynaConVariationContextProvider
{
    public TrimmedRequiredString Name { get; } = "OperatingSystem";
    public TrimmedRequiredString DefaultValue { get; } = "unknown";

    public string GetCurrentRawValue()
    {
        var deviceProperties = deviceAtlasService.Get();
        if (deviceProperties.Item1 && deviceProperties.Item2.TryGetValue("osName", out var operatingSystem))
        {
            return operatingSystem;
        }
        return DefaultValue;
    }
}
