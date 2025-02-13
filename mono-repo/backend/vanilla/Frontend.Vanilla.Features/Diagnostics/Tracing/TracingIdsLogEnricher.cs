using Frontend.Vanilla.Features.Logging;
using Serilog.Core;
using Serilog.Events;

namespace Frontend.Vanilla.Features.Diagnostics.Tracing;

internal sealed class TracingIdsLogEnricher(ITracingIdsProvider tracingIdsProvider) : ILogEventEnricher
{
    public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
    {
        var ids = tracingIdsProvider.GetTracingIds();

        logEvent.SetProperty(LogEventProperties.CorrelationId, ids.CorrelationId);
        logEvent.SetProperty(LogEventProperties.RequestId, ids.RequestId);

        if (ids.IsRecording)
            logEvent.SetProperty(LogEventProperties.TraceRecorded, true);
    }
}
