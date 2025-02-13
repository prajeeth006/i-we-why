using Serilog.Core;
using Serilog.Events;

namespace Frontend.Vanilla.Features.Logging;

internal sealed class MemorySink : ILogEventSink
{
    public static readonly IInMemoryLog Log = new TracedInMemoryLog(
        traceLogSize: 10_000,
        otherLogSize: 1_000);

    public void Emit(LogEvent logEvent)
        => Log.Add(logEvent);
}
