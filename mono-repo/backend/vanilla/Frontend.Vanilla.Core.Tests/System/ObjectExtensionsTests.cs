#nullable enable

using System;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public class ObjectExtensionsTests
{
    [Theory]
    [InlineData("Chuck", true)]
    [InlineData("Norris", true)]
    [InlineData("BWIN", false)]
    [InlineData("", false)]
    public void EqualsAnyTest(string value, bool expected)
        => value.EqualsAny("Chuck", "Norris").Should().Be(expected);

    [Theory]
    [InlineData("Superman", false)]
    [InlineData("Batman", true)]
    [InlineData("batMAN", true)]
    [InlineData("joker", true)]
    public void EqualsAny_ShouldUseComparer(string value, bool expected)
        => value.EqualsAny(new[] { "Batman", "Joker" }, StringComparer.OrdinalIgnoreCase).Should().Be(expected);

    [Theory]
    [InlineData("abc", "3")]
    [InlineData("", "0")]
    [InlineData(null, null)]
    public void IfNotNull_ReferenceType(string? input, string? expected)
        => input.IfNotNull(s => s.Length.ToString()).Should().Be(expected);

    [Theory]
    [InlineData(1, 3)]
    [InlineData(null, null)]
    public void IfNotNull_ValueType(int? input, int? expected)
        => input.IfNotNull(s => s + 2).Should().Be(expected);

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void If_ShouldCallAction_IfConditionPassed(bool condition)
    {
        var action = new Mock<Action<Tuple<string>>>();
        var target = Tuple.Create("abc");

        // Act
        var result = target.If(condition, action.Object);

        result.Should().BeSameAs(target);
        action.Verify(a => a(target), Times.Exactly(condition ? 1 : 0));
    }
}
