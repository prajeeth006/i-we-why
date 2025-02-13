#nullable enable

using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public class WrapperTests
{
    [Fact]
    public void Constructor_ShouldCreateCorrectly()
    {
        // Act
        var target = new Wrapper<int>(66);

        target.Value.Should().Be(66);
    }

    [Fact]
    public void OperatorCastFrom_ShouldCreateFromValue()
    {
        // Act
        Wrapper<int> target = 66;

        target.Value.Should().Be(66);
    }

    [Fact]
    public void OperatorCastTo_ShouldCastToValue()
    {
        // Act
        int value = new Wrapper<int>(66);

        value.Should().Be(66);
    }

    [Fact]
    public void ToString_ShouldReturnValueDetails()
        => new Wrapper<int>(66).ToString().Should().Be("Wrapped: 66");
}
