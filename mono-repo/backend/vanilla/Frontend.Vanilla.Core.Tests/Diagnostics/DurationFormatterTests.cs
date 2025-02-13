using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Diagnostics;

public class DurationFormatterTests
{
    [Theory]
    [InlineData(0, "0 ms")]
    [InlineData(1234, "1234 ms")]
    [InlineData(1.234, "1 ms")]
    [InlineData(1.999, "2 ms")]
    public void FormatDuration_ShouldFormatDuration(double millis, string expected)
        => TimeSpan.FromMilliseconds(millis).FormatDuration().Should().Be(expected);
}
