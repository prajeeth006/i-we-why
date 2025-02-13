using System;
using System.Diagnostics;

namespace Frontend.Vanilla.Core.Diagnostics;

internal static class CallerInfo
{
    /// <summary>
    /// Gets diagnostic information regarding external caller.
    /// Should be used in case of an error to provide sufficient data to fix it.
    /// </summary>
    public static string Get()
    {
        var stack = new StackTrace(fNeedFileInfo: true);

        // Wrap to easily recognizable block and separate from exception stack trace which most likely will follow
        var newLine = Environment.NewLine;
        const string title = "CALLER STACK TRACE";

        return $"{newLine}BEGIN {title}{newLine}{stack}END {title}{newLine}{newLine}";
    }
}
