#nullable enable

using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Parsing.Lexical;

public class DslNumberTests
{
    [Theory]
    [InlineData("123", 123)]
    [InlineData("  123 ", 123)]
    [InlineData("1.23", 1.23)]
    [InlineData(" 1.23  ", 1.23)]
    public void TryParse_ShouldParseCorreclty(string str, decimal expected)
    {
        // Act
        var ok = DslNumber.TryParse(str, out var actual);

        ok.Should().BeTrue();
        actual.Should().Be(expected);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("  ")]
    [InlineData("shit")]
    [InlineData("12.34.4")]
    [InlineData("1,23")]
    public void TryParse_ShouldNotParse_IfInvalid(string? str)
    {
        // Act
        var ok = DslNumber.TryParse(str, out var _);

        ok.Should().BeFalse();
    }

    [Theory]
    [InlineData(12345, "12345")]
    [InlineData(1.23, "1.23")]
    public void ToString_ShouldFormatCorrectly(decimal input, string expected)
        => DslNumber.ToString(input).Should().Be(expected);
}
