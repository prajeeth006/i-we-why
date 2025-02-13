using System.Collections.Generic;
using Frontend.Vanilla.Features.Diagnostics.Tracing;
using Frontend.Vanilla.Features.Logging;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Serilog.Core;
using Serilog.Events;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.Tracing;

public class TracingIdsLogEnricherTests
{
    private ILogEventEnricher target;
    private Mock<ITracingIdsProvider> tracingIdsProvider;
    private LogEvent logEvent;

    public TracingIdsLogEnricherTests()
    {
        tracingIdsProvider = new Mock<ITracingIdsProvider>();
        target = new TracingIdsLogEnricher(tracingIdsProvider.Object);
        logEvent = TestLogEvent.Get();
    }

    [Theory, BooleanData]
    public void ShouldAddPropertiesWithTracingIds(bool isRecording)
    {
        tracingIdsProvider.Setup(p => p.GetTracingIds()).Returns(("testCorrelation", "testRequest", isRecording, "whatever"));

        // Act
        target.Enrich(logEvent, null);

        var expected = new List<(string, object)>
        {
            (LogEventProperties.CorrelationId, "testCorrelation"),
            (LogEventProperties.RequestId, "testRequest"),
        };

        if (isRecording)
            expected.Add((LogEventProperties.TraceRecorded, true));

        logEvent.VerifyProperties(expected.ToArray());
    }
}
