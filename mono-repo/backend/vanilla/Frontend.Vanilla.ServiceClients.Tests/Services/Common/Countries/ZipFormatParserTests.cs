using System;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Common.Countries;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.Countries;

public class ZipFormatParserTests
{
    [Theory]
    // ----------- requ.    alpha   num.    space
    [InlineData("D", true, false, true, false)]
    [InlineData("L", true, true, false, false)]
    [InlineData("A", true, true, true, false)]
    [InlineData("S", true, false, false, true)]
    [InlineData("X", true, true, true, true)]
    [InlineData("d", false, false, true, false)]
    [InlineData("l", false, true, false, false)]
    [InlineData("a", false, true, true, false)]
    [InlineData("s", false, false, false, true)]
    [InlineData("x", false, true, true, true)]
    public void ShouldCreateProperRegex(string pattern, bool isRequired, bool matchesAlpha, bool matchesNumeric, bool matchesSpace)
    {
        var regex = ZipFormatParser.Parse(pattern).Regex; // Act

        regex.IsMatch("").Should().Be(!isRequired);
        regex.IsMatch("a").Should().Be(matchesAlpha);
        regex.IsMatch("1").Should().Be(matchesNumeric);
        regex.IsMatch(" ").Should().Be(matchesSpace);

        // Pattern must match whole string
        regex.IsMatch("aa").Should().BeFalse();
        regex.IsMatch("11").Should().BeFalse();
        regex.IsMatch("  ").Should().BeFalse();
    }

    [Theory]
    [InlineData("DLASX", 5, 5)]
    [InlineData("dlasx", 0, 5)]
    [InlineData("DlASx", 3, 5)]
    public void ShouldCalculateMinMaxLength(string pattern, int expectedMin, int expectedMax)
    {
        var zipFormat = ZipFormatParser.Parse(pattern); // Act

        zipFormat.MinLength.Should().Be(expectedMin);
        zipFormat.MaxLength.Should().Be(expectedMax);
    }

    [Theory]
    [InlineData("RAW(1, 2, /regex/)", 1, 2, "regex")]
    [InlineData("RAW(1, 2, //)", 1, 2, "")]
    [InlineData("  RAW  (  1  ,  2  ,  / any / char /  )  ", 1, 2, " any / char ")]
    public void ShouldSupportRawFormat(string input, int expectedMin, int expectedMax, string expectedRegex)
    {
        var zipFormat = ZipFormatParser.Parse(input); // Act

        zipFormat.MinLength.Should().Be(expectedMin);
        zipFormat.MaxLength.Should().Be(expectedMax);
        zipFormat.Regex.ToString().Should().Be(expectedRegex);
    }

    [Theory, ValuesData(null, "")]
    public void ShouldReturnDefaultZipFormatIfNullOrEmpty(string pattern)
    {
        var zipFormat = ZipFormatParser.Parse(pattern);

        zipFormat.MinLength.Should().Be(3);
        zipFormat.MaxLength.Should().Be(9);

        // Regex is really just simple substitution, not much to see here
        zipFormat.Regex.ToString().Should()
            .Be(@"(?=^[0-9a-zA-Z][0-9a-zA-Z][0-9a-zA-Z][0-9a-zA-Z]?[0-9a-zA-Z]?[0-9a-zA-Z]?[0-9a-zA-Z]?[0-9a-zA-Z]?[0-9a-zA-Z]?$)(?!.*\s\s)");
    }

    [Theory]
    [InlineData("dlWsx", "Unsupported character 'W' in standard ZIP format. Supported chars (can be upper-case): dlasx")]
    [InlineData("RAW(gibberish)", "Invalid raw ZIP format. Expected format: 'RAW(123, 456, /any-regex-chars/)' where 123 is min length and 456 is max length.")]
    [InlineData("RAW(5, 1, /regex/)", "MaxLength = 1 must be greater or equal to MinLength = 5")]
    public void ShouldThrowIfInvalid(string input, string expectedError)
    {
        Action act = () => ZipFormatParser.Parse(input);

        act.Should().Throw<InvalidOperationException>()
            .WithMessage("Failed parsing ZIP format: " + input)
            .WithInnerMessage(expectedError);
    }
}
