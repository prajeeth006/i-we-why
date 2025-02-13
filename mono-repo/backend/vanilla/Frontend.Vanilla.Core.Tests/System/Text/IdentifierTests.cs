using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System.Text;

public sealed class IdentifierTests
{
    [Theory]
    [InlineData("foo")]
    [InlineData("satan66")]
    [InlineData("Chuck_Norris")]
    public void Constructor_ShouldCreateCorrectly(string value)
    {
        // Act
        var target = new Identifier(value);

        target.Value.Should().BeSameAs(value);
    }

    public static readonly IEnumerable<object[]> InvalidTestCases
        = TrimmedRequiredStringTests.InvalidTestCases.Append(
            new object[] { "2_notStartingLetter", "doesn't start with a letter" },
            new object[] { "Not-supported čhars?", "contains unsupported characters: '-', ' ', 'č', '?'" });

    [Theory]
    [MemberData(nameof(InvalidTestCases))]
    public void Constructor_ShouldThrow_IfInvalid(string value, string expectedError)
        => new Func<object>(() => new Identifier(value))
            .Should().Throw<ArgumentException>()
            .Which.Message.Contains(expectedError);

    [Theory]
    [InlineData('a', true)]
    [InlineData('f', true)]
    [InlineData('z', true)]
    [InlineData('A', true)]
    [InlineData('M', true)]
    [InlineData('Z', true)]
    [InlineData('7', true)]
    [InlineData('_', true)]
    [InlineData('?', false)]
    [InlineData('-', false)]
    [InlineData(' ', false)]
    [InlineData('ô', false)]
    public void IsValidChar_Test(char input, bool expected)
        => Identifier.IsValidChar(input).Should().Be(expected);
}
