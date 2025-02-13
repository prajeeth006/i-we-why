using System;
using System.Globalization;

namespace Frontend.Vanilla.Core.Diagnostics;

internal static class DurationFormatter
{
    /// <summary>
    /// For diagnostic measurements. Shows duration in milliseconds b/c it's readable and lower values are insignificant to optimize.
    /// </summary>
    public static string FormatDuration(this TimeSpan timeSpan)
        => timeSpan.TotalMilliseconds.ToString("F0", CultureInfo.InvariantCulture) + " ms";
}
