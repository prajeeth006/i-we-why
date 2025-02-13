using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Time;

public class ClockTests
{
    private IClock target;
    private Mock<IUserTimeTransformer> userTimeTransformer;
    private DateTime testStartTime;

    public ClockTests()
    {
        userTimeTransformer = new Mock<IUserTimeTransformer>();
        target = new Clock(userTimeTransformer.Object);
        testStartTime = DateTime.UtcNow;
    }

    [Fact]
    public void UtcNow_ShouldReturnCurrentTime()
        => VerifyCurrentUtcTime(target.UtcNow.Value);

    [Fact]
    public void UserLocalNow_ShouldConvertToUserLocalTime()
    {
        var userTime = new DateTimeOffset(new DateTime(2000, 1, 2), TimeSpan.FromHours(6));
        userTimeTransformer.SetupWithAnyArgs(t => t.ToUserDateTimeOffset(default)).Returns(userTime);

        // Act
        var result = target.UserLocalNow;

        result.Should().Be(userTime);
        VerifyCurrentUtcTime(((UtcDateTime)userTimeTransformer.Invocations.Single().Arguments.Single()).Value);
    }

    [Fact]
    public void UnixTimeMilliseconds_ShouldConvertCurrentTime()
    {
        // Act
        var result = target.UnixTimeMilliseconds;

        VerifyCurrentUtcTime(DateTimeOffset.FromUnixTimeMilliseconds(result).DateTime);
    }

    private void VerifyCurrentUtcTime(DateTime time)
        => time.Should().BeOnOrAfter(testStartTime.AddMilliseconds(-1))
            .And.BeOnOrBefore(DateTime.UtcNow.AddMilliseconds(1));

    [Fact]
    public void SystemTimeZoneTransformer_ShouldUseLocal()
    {
        var transformer = new SystemTimeZoneTransformer();
        var time = new UtcDateTime(2000, 1, 2);

        // Act
        var result = transformer.ToUserDateTimeOffset(time);

        var expectedOffset = TimeZoneInfo.Local.BaseUtcOffset;
        result.DateTime.Should().Be(time.Value + expectedOffset);
        result.Offset.Should().Be(expectedOffset);
    }
}
