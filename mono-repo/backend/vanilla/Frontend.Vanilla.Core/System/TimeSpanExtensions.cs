using System;

namespace Frontend.Vanilla.Core.System;

/// <summary>
/// Extensions methods for <see cref="TimeSpan" />.
/// </summary>
internal static class TimeSpanExtensions
{
    public static TimeSpan Multiply(this TimeSpan time, double factor)
        => new TimeSpan((long)(time.Ticks * factor));
}
