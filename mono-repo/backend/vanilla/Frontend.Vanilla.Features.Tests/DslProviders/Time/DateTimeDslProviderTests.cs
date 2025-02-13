using System;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders.Time;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders.Time;

public class DateTimeDslProviderTests
{
    private readonly IDateTimeDslProvider target;
    private readonly TestClock clock;
    private readonly Mock<IDateTimeDslCalculator> calculator;

    public DateTimeDslProviderTests()
    {
        clock = new TestClock();
        calculator = new Mock<IDateTimeDslCalculator>();
        target = new DateTimeDslProvider(clock, calculator.Object);
    }

    [Fact]
    public void GetNow_ShouldPassCorrectTime()
    {
        calculator.Setup(c => c.GetTime(clock.UserLocalNow)).Returns(10);
        target.GetNow().Should().Be(10);
    }

    [Fact]
    public void GetUtcNow_ShouldPassCorrectTime()
    {
        calculator.Setup(c => c.GetTime(clock.UtcNow.ValueWithOffset)).Returns(11);
        target.GetUtcNow().Should().Be(11);
    }

    [Fact]
    public void GetToday_ShouldPassCorrectTime()
    {
        calculator.Setup(c => c.GetDate(clock.UserLocalNow)).Returns(20);
        target.GetToday().Should().Be(20);
    }

    [Fact]
    public void GetUtcToday_ShouldPassCorrectTime()
    {
        calculator.Setup(c => c.GetDate(clock.UtcNow.ValueWithOffset)).Returns(21);
        target.GetUtcToday().Should().Be(21);
    }

    [Fact]
    public void GetTimeOfDay_ShouldPassCorrectTime()
    {
        calculator.Setup(c => c.GetTimeOfDay(clock.UserLocalNow)).Returns(30);
        target.GetTimeOfDay().Should().Be(30);
    }

    [Fact]
    public void GetUtcTimeOfDay_ShouldPassCorrectTime()
    {
        calculator.Setup(c => c.GetTimeOfDay(clock.UtcNow.ValueWithOffset)).Returns(31);
        target.GetUtcTimeOfDay().Should().Be(31);
    }

    [Fact]
    public void GetDayOfWeek_ShouldPassCorrectTime()
    {
        calculator.Setup(c => c.GetDayOfWeek(clock.UserLocalNow)).Returns("Caturday");
        target.GetDayOfWeek().Should().Be("Caturday");
    }

    [Fact]
    public void GetUtcDayOfWeek_ShouldPassCorrectTime()
    {
        calculator.Setup(c => c.GetDayOfWeek(clock.UtcNow.ValueWithOffset)).Returns("D-Day");
        target.GetUtcDayOfWeek().Should().Be("D-Day");
    }

    [Fact]
    public void DateTime_ShouldPassCorrectTime()
    {
        calculator.Setup(c => c.CreateTime(2000, 1, 2, 3, 4, clock.UserLocalNow.Offset)).Returns(40);
        target.DateTime(2000, 1, 2, 3, 4).Should().Be(40);
    }

    [Fact]
    public void UtcDateTime_ShouldPassCorrectTime()
    {
        calculator.Setup(c => c.CreateTime(2001, 2, 3, 4, 5, TimeSpan.Zero)).Returns(41);
        target.UtcDateTime(2001, 2, 3, 4, 5).Should().Be(41);
    }

    [Fact]
    public void Date_ShouldPassCorrectTime()
    {
        calculator.Setup(c => c.CreateTime(2002, 3, 4, 0, 0, clock.UserLocalNow.Offset)).Returns(50);
        target.Date(2002, 3, 4).Should().Be(50);
    }

    [Fact]
    public void UtcDate_ShouldPassCorrectTime()
    {
        calculator.Setup(c => c.CreateTime(2003, 4, 5, 0, 0, TimeSpan.Zero)).Returns(51);
        target.UtcDate(2003, 4, 5).Should().Be(51);
    }

    [Fact]
    public void Time_ShouldPassCorrectTime()
    {
        calculator.Setup(c => c.CreateTimeOfDay(8, 9)).Returns(60);
        target.Time(8, 9).Should().Be(60);
    }
}
