using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Features.DslProviders.Time;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders.Time;

public class DateTimeDslCalculatorTests
{
    private readonly IDateTimeDslCalculator target;
    private readonly Mock<IDslTimeConverter> converter;
    private readonly Mock<IDateTimeCultureBasedFormatter> formatter;

    public DateTimeDslCalculatorTests()
    {
        converter = new Mock<IDslTimeConverter>();
        formatter = new Mock<IDateTimeCultureBasedFormatter>();
        target = new DateTimeDslCalculator(converter.Object, formatter.Object);
        converter.Setup(c => c.ToDsl(It.IsAny<DateTimeOffset>())).Returns(666);
        converter.Setup(c => c.ToDsl(It.IsAny<TimeSpan>())).Returns(777);
        formatter.Setup(x => x.Format(It.IsAny<DateTime>(), It.IsAny<string>())).Returns("01/11/2021");
        TestCulture.Set("de-AT"); // To test that error messages use invariant culture
    }

    private void Verify(decimal result, DateTimeOffset expected)
    {
        result.Should().Be(666);
        converter.Verify(c => c.ToDsl(expected));
    }

    private void Verify(decimal result, TimeSpan expected)
    {
        result.Should().Be(777);
        converter.Verify(c => c.ToDsl(expected));
    }

    [Fact]
    public void GetTime_ShouldTruncateSecondsAndConvert()
        => Verify(target.GetTime(new DateTimeOffset(2000, 1, 2, 3, 4, 5, 6, TimeSpan.FromHours(8))),
            expected: new DateTimeOffset(2000, 1, 2, 3, 4, 0, 0, TimeSpan.FromHours(8)));

    [Fact]
    public void GetDate_ShouldTruncateTimeOfDayAndConvert()
        => Verify(target.GetDate(new DateTimeOffset(2001, 2, 3, 4, 5, 6, 7, TimeSpan.FromHours(7))),
            expected: new DateTimeOffset(2001, 2, 3, 0, 0, 0, 0, TimeSpan.FromHours(7)));

    [Fact]
    public void Format_ShouldReturnFormattedString()
    {
        target.Format(2021, 11, 01).Should().Be("01/11/2021");
    }

    [Fact]
    public void GetTimeOfDay_ShouldGetTimeOfDayAndConvert()
        => Verify(target.GetTimeOfDay(new DateTimeOffset(2002, 3, 4, 5, 6, 7, 8, TimeSpan.FromHours(6))),
            expected: new TimeSpan(5, 6, 0));

    [Fact]
    public void GetDayOfWeek_ShouldCalculateCorrectly()
    {
        var time = new DateTimeOffset(2003, 1, 4, 5, 6, 7, 8, TimeSpan.FromHours(5));
        target.GetDayOfWeek(time).Should().Be("Saturday");
    }

    public static TheoryData<int, int, int> ValidDates => new TheoryData<int, int, int>
    {
        { 2020, 2, 3 }, // Something
        { 1000, 2, 3 }, // Min year
        { 3000, 2, 3 }, // Max year
        { 2020, 1, 3 }, // Min month
        { 2020, 12, 3 }, // Max month
        { 2020, 2, 1 }, // Min day
        { 2020, 2, 29 }, // Max day
    };

    public static TheoryData<decimal, decimal, decimal, string> InvalidDates => new TheoryData<decimal, decimal, decimal, string>
    {
        { 2000.1m, 1, 1, "Year component of a (date)time must be an integer but specified 2000.1 has a decimal part." },
        { 2000, 1.2m, 1, "Month component of a (date)time must be an integer but specified 1.2 has a decimal part." },
        { 2000, 1, 1.3m, "Day component of a (date)time must be an integer but specified 1.3 has a decimal part." },
        { 666, 1, 1, "Year component of a (date)time must be between 1000 and 3000 (both inclusively) but specified 666 is out of this range." },
        { 3500, 1, 1, "Year component of a (date)time must be between 1000 and 3000 (both inclusively) but specified 3500 is out of this range." },
        { 2000, 0, 1, "Month component of a (date)time must be between 1 and 12 (both inclusively) but specified 0 is out of this range." },
        { 2000, 13, 1, "Month component of a (date)time must be between 1 and 12 (both inclusively) but specified 13 is out of this range." },
        { 2000, 1, 0, "Day component of a (date)time must be between 1 and 31 (both inclusively) but specified 0 is out of this range." },
        { 2000, 1, 32, "Day component of a (date)time must be between 1 and 31 (both inclusively) but specified 32 is out of this range." },
    };

    public static TheoryData<int, int> ValidTimesOfDay => new TheoryData<int, int>
    {
        { 13, 45 }, // Something
        { 0, 45 }, // Min hour
        { 23, 45 }, // Max hour
        { 13, 0 }, // Min minute
        { 13, 59 }, // Max minute
    };

    public static TheoryData<decimal, decimal, string> InvalidTimesOfDay => new TheoryData<decimal, decimal, string>
    {
        { 12.1m, 1, "Hour component of a (date)time must be an integer but specified 12.1 has a decimal part." },
        { 12, 1.3m, "Minute component of a (date)time must be an integer but specified 1.3 has a decimal part." },
        { -1, 1, "Hour component of a (date)time must be between 0 and 23 (both inclusively) but specified -1 is out of this range." },
        { 24, 1, "Hour component of a (date)time must be between 0 and 23 (both inclusively) but specified 24 is out of this range." },
        { 12, -1, "Minute component of a (date)time must be between 0 and 59 (both inclusively) but specified -1 is out of this range." },
        { 12, 60, "Minute component of a (date)time must be between 0 and 59 (both inclusively) but specified 60 is out of this range." },
    };

    public static IEnumerable<object[]> ValidDateTimes
        => ValidDates.Select(d => new[] { d.Data.Item1, d.Data.Item2, d.Data.Item3, 1, 1 })
            .Concat(ValidTimesOfDay.Select(d => new[] { 2000, 1, 2, d.Data.Item1, d.Data.Item2 }))
            .Select(x => new object[] { x[0], x[1], x[2], x[3], x[4] });

    public static IEnumerable<object[]> InvalidDateTimes
        => InvalidDates.Select(d => new object[] { d.Data.Item1, d.Data.Item2, d.Data.Item3, 1M, 1M, d.Data.Item4 })
            .Concat(InvalidTimesOfDay.Select(d => new object[] { 2000M, 1M, 2M, d.Data.Item1, d.Data.Item2, d.Data.Item3 }));

    [Theory, MemberData(nameof(ValidDateTimes))]
    public void CreateTime_ShouldCreateCorrectlyAndConvert(int year, int month, int day, int hour, int minute)
        => Verify(target.CreateTime(year, month, day, hour, minute, TimeSpan.FromHours(4)),
            expected: new DateTimeOffset(year, month, day, hour, minute, 0, TimeSpan.FromHours(4)));

    [Theory, MemberData(nameof(InvalidDateTimes))]
    public void CreateTime_ShouldThrow_IfInvalid(decimal year, decimal month, decimal day, decimal hour, decimal minute, string expectedMsg)
        => new Action(() => target.CreateTime(year, month, day, hour, minute, TimeSpan.FromHours(4)))
            .Should().Throw().WithMessage(expectedMsg);

    [Theory, MemberData(nameof(ValidTimesOfDay))]
    public void CreateTimeOfDay_ShouldCreateCorrectlyAndConvert(int hour, int minute)
        => Verify(target.CreateTimeOfDay(hour, minute),
            expected: new TimeSpan(hour, minute, 0));

    [Theory, MemberData(nameof(InvalidTimesOfDay))]
    public void CreateTimeOfDay_ShouldThrow_IfInvalid(decimal hour, decimal minute, string expectedMsg)
        => new Action(() => target.CreateTimeOfDay(hour, minute))
            .Should().Throw().WithMessage(expectedMsg);
}
