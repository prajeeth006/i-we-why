using System;
using System.Collections.Generic;
using System.Diagnostics;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Features.Logging;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Diagnostics.Tracing;

/// <summary>
/// Records trace information for Vanilla web apps.
/// </summary>
internal sealed class WebRecordingTrace(ILogger logger) : IRecordingTrace
{
    public ILogger Logger { get; } = logger;
    private readonly StackTrace callerStackTrace = new (fNeedFileInfo: true);
    private readonly long start = Stopwatch.GetTimestamp();

    public void Record(string message, Exception? exception, IDictionary<string, object?> values)
    {
        values.Add(
            (LogEventProperties.Message, message),
            ("durationMillis", Stopwatch.GetElapsedTime(start).TotalMilliseconds),
            ("callerStackTrace", callerStackTrace.ToString())); // Last b/c stack is too long

        Logger.Log(LogLevel.Trace, eventId: default, values, exception, (_, _) => message);
    }
}
