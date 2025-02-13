namespace Frontend.Vanilla.Features.Clock;

internal interface IClockConfiguration
{
    string SlotName { get; }
    bool IsEnabled { get; }
    string DateTimeFormat { get; }
    bool UseWithTimeZone { get; }
}

internal sealed class ClockConfiguration(string slotName, string dateTimeFormat, bool useWithTimeZone) : IClockConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.Clock";

    public string SlotName { get; set; } = slotName;
    public bool IsEnabled { get; set; }
    public string DateTimeFormat { get; set; } = dateTimeFormat;
    public bool UseWithTimeZone { get; set; } = useWithTimeZone;
}
