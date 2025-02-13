using FluentAssertions;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.Login.ErrorFormatters;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Login.ErrorConverters;

public class TimeSpanLoginErrorConverterTests
{
    private TestLogger<TimeSpanLoginErrorConverter> logMock;
    private TimeSpanLoginErrorConverter timeSpanConverter;

    public TimeSpanLoginErrorConverterTests()
    {
        logMock = new TestLogger<TimeSpanLoginErrorConverter>();
        timeSpanConverter = new TimeSpanLoginErrorConverter(logMock);
    }

    [Fact]
    public void ShouldConvertToTimeSpan()
    {
        var errorCodeHandler = new ErrorHandlerParameter { Name = "TIME_IN_MILLIS", Type = "TimeSpan", From = "Milliseconds", To = "Minutes" };
        var newValue = timeSpanConverter.Convert("1800000", errorCodeHandler);

        newValue.Should().Be(30);
    }

    [Fact]
    public void ShouldReturnOneWhenValueIsLower()
    {
        var errorCodeHandler = new ErrorHandlerParameter { Name = "TIME_IN_MILLIS", Type = "TimeSpan", From = "Milliseconds", To = "Minutes" };
        var newValue = timeSpanConverter.Convert("30000", errorCodeHandler);

        newValue.Should().Be(1);
    }

    [Fact]
    public void ShouldReturnInitialValueWhenSettingInvalidParameters()
    {
        var errorCodeHandler = new ErrorHandlerParameter { Name = "TIME_IN_MILLIS", Type = "TimeSpan", From = "Millis", To = "Minutes" };
        var newValue = timeSpanConverter.Convert("1800000", errorCodeHandler);

        newValue.Should().Be("1800000");
        var logged = logMock.Logged[0];
        logged.Level.Should().Be(LogLevel.Error);
        logged.FinalMessage.Should().Be("Invalid parameter for TimeSpan convert from. Value: Millis");

        errorCodeHandler = new ErrorHandlerParameter { Name = "TIME_IN_MILLIS", Type = "TimeSpan", From = "Milliseconds", To = "Min" };
        newValue = timeSpanConverter.Convert("1800000", errorCodeHandler);

        newValue.Should().Be("1800000");
        logged = logMock.Logged[1];
        logged.Level.Should().Be(LogLevel.Error);
        logged.FinalMessage.Should().Be("Invalid parameter for TimeSpan convert to. Value: Min");
    }
}
