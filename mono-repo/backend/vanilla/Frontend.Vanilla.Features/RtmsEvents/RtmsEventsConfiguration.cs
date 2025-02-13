using System.Collections.Generic;

namespace Frontend.Vanilla.Features.RtmsEvents;

internal interface IRtmsEventsConfiguration
{
    bool IsCashierRedirectEnabled { get; }
    public IReadOnlyDictionary<string, ToastrInfo> RtmsEventToToastr { get; }
}

internal sealed class RtmsEventsConfiguration(bool isCashierRedirectEnabled, IReadOnlyDictionary<string, ToastrInfo> rtmsEventToToastr)
    : IRtmsEventsConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.RtmsEvents";

    public bool IsCashierRedirectEnabled { get; } = isCashierRedirectEnabled;
    public IReadOnlyDictionary<string, ToastrInfo> RtmsEventToToastr { get; } = rtmsEventToToastr;
}

internal sealed class ToastrInfo(string name, string? schedule, IReadOnlyDictionary<string, PropertyInfo>? placeholders)
{
    public string Name { get; } = name;
    public string? Schedule { get; } = schedule;
    public IReadOnlyDictionary<string, PropertyInfo>? Placeholders { get; } = placeholders;
}

internal sealed class PropertyInfo(string propertyName, string format, Parameters parameters)
{
    public string PropertyName { get; } = propertyName;
    public string Format { get; } = format;
    public Parameters Parameters { get; } = parameters;
}

internal sealed class Parameters(string? currencyCode, string? digitsInfo, string? dateFormat, string? timezone)
{
    public string? CurrencyCode { get; } = currencyCode;
    public string? DigitsInfo { get; } = digitsInfo;
    public string? DateFormat { get; } = dateFormat;
    public string? Timezone { get; } = timezone;
}
