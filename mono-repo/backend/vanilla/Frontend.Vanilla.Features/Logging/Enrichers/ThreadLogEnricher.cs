using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Core.System;
using Serilog.Core;
using Serilog.Events;

namespace Frontend.Vanilla.Features.Logging.Enrichers;

/// <summary>
/// Adds info about current thread.
/// </summary>
internal sealed class ThreadLogEnricher(IThread thread) : ILogEventEnricher
{
    public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
    {
        logEvent.SetProperty(LogEventProperties.ThreadId, thread.ManagedThreadId.ToInvariantString());
        logEvent.SetProperty(LogEventProperties.ThreadCulture, thread.CurrentCulture.Name);
    }
}
