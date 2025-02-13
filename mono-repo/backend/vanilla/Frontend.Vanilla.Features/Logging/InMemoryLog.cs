using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Serilog.Events;

namespace Frontend.Vanilla.Features.Logging;

/// <summary>
/// Stores log entries in memory. Use fixed array and rotate it to be bloody fast and lock threads as least as possible.
/// </summary>
internal interface IInMemoryLog
{
    void Add(LogEvent entry);
    IEnumerable<LogEvent> GetEntries();
}

internal sealed class TracedInMemoryLog(int traceLogSize, int otherLogSize) : IInMemoryLog
{
    private readonly TemporaryBuffer<LogEvent> traceLog = new (traceLogSize);
    private readonly TemporaryBuffer<LogEvent> otherLog = new (otherLogSize);

    public void Add(LogEvent entry)
    {
        var log = entry.Properties.ContainsKey(LogEventProperties.TraceRecorded) ? traceLog : otherLog;
        log.Add(entry);
    }

    public IEnumerable<LogEvent> GetEntries()
        => traceLog.Concat(otherLog);
}
