using System.Globalization;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Features.Logging;
using Frontend.Vanilla.Features.Logging.Enrichers;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Serilog.Core;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Logging.Enrichers;

public class ThreadLogEnricherTests
{
    private ILogEventEnricher target;
    private Mock<IThread> thread;

    public ThreadLogEnricherTests()
    {
        thread = new Mock<IThread>();
        target = new ThreadLogEnricher(thread.Object);
    }

    [Fact]
    public void ShouldLogThreadDetails()
    {
        thread.SetupGet(t => t.ManagedThreadId).Returns(66);
        thread.SetupGet(t => t.CurrentCulture).Returns(new CultureInfo("zh-CN"));
        var logEvent = TestLogEvent.Get();

        // Act
        target.Enrich(logEvent, null);

        logEvent.VerifyProperties(
            (LogEventProperties.ThreadId, "66"),
            (LogEventProperties.ThreadCulture, "zh-CN"));
    }
}
