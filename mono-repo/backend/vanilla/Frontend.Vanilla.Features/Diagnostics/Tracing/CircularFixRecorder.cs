#nullable disable
using System;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Features.Diagnostics.Tracing;

internal sealed class CircularFixRecorder<TFixedRecorder>(Func<TFixedRecorder> fixedRecorder) : ITraceRecorder
    where TFixedRecorder : ITraceRecorder
{
    private readonly Lazy<TFixedRecorder> fixedRecorder = fixedRecorder.ToLazy();

    public IRecordingTrace GetRecordingTrace()
        => fixedRecorder.Value.GetRecordingTrace();

    public void StartRecording()
        => fixedRecorder.Value.StartRecording();

    public void StopRecording()
        => fixedRecorder.Value.StopRecording();
}
