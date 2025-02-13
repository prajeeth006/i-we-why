using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Features.Diagnostics.Tracing;
using Frontend.Vanilla.Features.Logging;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.Tracing;

public class WebRecordingTraceTests
{
    private IRecordingTrace target;
    private Mock<ILogger> log;

    public WebRecordingTraceTests()
    {
        log = new Mock<ILogger>();
        target = new WebRecordingTrace(log.Object);
    }

    [Fact]
    internal void ShouldRecordTrace()
    {
        var ex = new Exception("Oups");
        var values = new Dictionary<string, object>
        {
            { "val1", "111" },
            { "val2", 222 },
        };

        target.Record("MyTraceMsg", ex, values); // Act

        log.Verify(l => l.Log(LogLevel.Trace, default, values, ex, It.IsNotNull<Func<IDictionary<string, object>, Exception, string>>()));
        values.Keys.Should().BeEquivalentTo("val1", "val2", LogEventProperties.Message, "durationMillis", "callerStackTrace");
        values["val1"].Should().Be("111");
        values["val2"].Should().Be(222);
        values[LogEventProperties.Message].Should().Be("MyTraceMsg");
        values["durationMillis"].Should().BeOfType<double>()
            .Which.Should().BeGreaterThan(0);
        values["callerStackTrace"].Should().BeOfType<string>()
            .Which.Should().ContainAll(nameof(WebRecordingTraceTests));
    }
}
