using System;
using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Core.Diagnostics;

/// <summary>
/// Records debug information for diagnostic purposes if recording is enabled.
/// </summary>
internal interface ITraceRecorder
{
    /// <summary>Also starts a stopwatch if recording so it should be called before actual operation.</summary>
    IRecordingTrace? GetRecordingTrace();

    void StartRecording();
    void StopRecording();
}

internal interface IRecordingTrace
{
    void Record(string message, Exception? exception, IDictionary<string, object?> values);
}

internal static class RecordingTraceExtensions
{
    public static void Record(this IRecordingTrace trace, string message, params (string, object?)[] values)
        => trace.Record(message, exception: null, values);

    public static void Record(this IRecordingTrace trace, string message, Exception? exception, params (string, object?)[] values)
        => trace.Record(message, exception, values.ToDictionary());

    public static void Record(this IRecordingTrace trace, string message, IDictionary<string, object?> values)
        => trace.Record(message, exception: null, values);
}

internal sealed class DisabledTraceRecorder : ITraceRecorder
{
    public IRecordingTrace? GetRecordingTrace() => null;
    public void StartRecording() => throw new NotSupportedException();
    public void StopRecording() => throw new NotSupportedException();
}
