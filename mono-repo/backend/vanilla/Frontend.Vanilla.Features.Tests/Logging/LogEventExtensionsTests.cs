using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Features.Logging;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Serilog.Events;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Logging;

public class LogEventExtensionsTests
{
    private LogEvent logEvent;

    public LogEventExtensionsTests()
    {
        logEvent = TestLogEvent.Get();
        logEvent.AddPropertyIfAbsent(new LogEventProperty("foo", new ScalarValue("previous")));
    }

    [Fact]
    public void SetProperty_ShouldAddScalarProperty_IfString()
    {
        // Act
        logEvent.SetProperty("foo", "bar");

        VerifyProperty("foo", "bar");
    }

    [Theory, BooleanData]
    public void SetProperty_ShouldAddScalarProperty_IfBool(bool value)
    {
        // Act
        logEvent.SetProperty("foo", value);

        VerifyProperty("foo", value);
    }

    private void VerifyProperty(string name, object value)
    {
        var prop = logEvent.Properties.Single();
        prop.Key.Should().Be(name);
        prop.Value.Should().BeOfType<ScalarValue>().Which.Value.Should().Be(value);
    }
}
