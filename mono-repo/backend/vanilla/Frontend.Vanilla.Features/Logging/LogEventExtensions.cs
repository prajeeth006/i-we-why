using Serilog.Events;

namespace Frontend.Vanilla.Features.Logging;

internal static class LogEventExtensions
{
    public static void SetProperty(this LogEvent logEvent, string name, string? value)
        => logEvent.SetScalarProperty(name, value);

    public static void SetProperty(this LogEvent logEvent, string name, bool value)
        => logEvent.SetScalarProperty(name, value);

    private static void SetScalarProperty(this LogEvent logEvent, string name, object? value)
        => logEvent.AddOrUpdateProperty(new LogEventProperty(name, new ScalarValue(value)));
}
