using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Serilog.Events;

namespace Frontend.Vanilla.Testing.Fakes;

internal static class TestLogEvent
{
    public static LogEvent Get()
    {
        return new LogEvent(DateTimeOffset.UtcNow, LogEventLevel.Error, new ArgumentException("makarona"), MessageTemplate.Empty, new List<LogEventProperty>());
    }

    public static void VerifyProperties(this LogEvent logEvent, params (string Name, object Json)[] expected)
    {
        logEvent.Properties.Select(p => (p.Key, ((ScalarValue)p.Value).Value)).Should().BeEquivalentTo(expected);
    }

    public static void VerifyNoProperties(this LogEvent logEvent, params (string Name, object Json)[] expected)
    {
        logEvent.Properties.Select(p => (p.Key, ((ScalarValue)p.Value).Value)).Should().NotBeEquivalentTo(expected);
    }
}
