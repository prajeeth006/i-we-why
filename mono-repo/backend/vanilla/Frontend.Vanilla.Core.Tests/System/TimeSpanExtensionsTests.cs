using System;
using FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public class TimeSpanExtensionsTests
{
    [Theory]
    [InlineData(3, 30)]
    [InlineData(0.2, 2)]
    [InlineData(-1.2, -12)]
    [InlineData(0, 0)]
    public void Multiply_Test(double factor, int expectedSeconds)
    {
        var result = TimeSpan.FromSeconds(10).Multiply(factor); // Act
        result.Should().Be(TimeSpan.FromSeconds(expectedSeconds));
    }
}
