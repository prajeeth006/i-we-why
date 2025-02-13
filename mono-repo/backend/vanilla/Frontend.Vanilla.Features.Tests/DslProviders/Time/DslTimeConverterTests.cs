using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Features.DslProviders.Time;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders.Time;

public class DslTimeConverterTests
{
    private readonly IDslTimeConverter target = new DslTimeConverter();

    public static IEnumerable<object[]> GetTimeTestCases(bool toDsl)
    {
        yield return new object[] { new DateTimeOffset(2016, 12, 3, 12, 25, 0, TimeSpan.Zero), 1480767900m };

        // Timezone isn't preserved
        if (toDsl) yield return new object[] { new DateTimeOffset(2018, 5, 18, 0, 0, 0, TimeSpan.FromHours(3)), 1526590800m };

        // Milliseconds should be truncated both ways
        if (toDsl) yield return new object[] { new DateTimeOffset(2018, 5, 18, 2, 3, 4, 756, TimeSpan.FromHours(3.75)), 1526595484m };
        else yield return new object[] { new DateTimeOffset(2016, 12, 3, 12, 25, 0, TimeSpan.Zero), 1480767900.756m };
    }

    [Theory, MemberData(nameof(GetTimeTestCases), true)]
    public void ToDsl_ShouldConvertTimeToUnixTime(DateTimeOffset input, decimal expected)
        => target.ToDsl(input).Should().Be(expected);

    [Theory, MemberData(nameof(GetTimeTestCases), false)]
    public void FromDslToTime_ShouldConvertFromUnixTime(DateTimeOffset expected, decimal input)
        => target.FromDslToTime(input).Should().Be(expected)
            .And.HaveOffset(expected.Offset);

    public static IEnumerable<object[]> GetTimeSpanTestCases(bool toDsl)
    {
        yield return new object[] { TimeSpan.Zero, 0m };
        yield return new object[] { new TimeSpan(5, 45, 0), 20700m };
        yield return new object[] { TimeSpan.FromSeconds(-66), -66m };

        // Milliseconds should be truncated both ways
        if (toDsl) yield return new object[] { TimeSpan.FromSeconds(3.567), 3m };
        else yield return new object[] { TimeSpan.FromSeconds(3), 3.567m };
    }

    [Theory, MemberData(nameof(GetTimeSpanTestCases), true)]
    public void ToDsl_ShouldConvertTimeSpanToTotalSeconds(TimeSpan input, decimal expected)
        => target.ToDsl(input).Should().Be(expected);

    [Theory, MemberData(nameof(GetTimeSpanTestCases), false)]
    public void FromDslToTimeSpan_ShouldConvertFromSeconds(TimeSpan expected, decimal input)
        => target.FromDslToTimeSpan(input).Should().Be(expected);
}
