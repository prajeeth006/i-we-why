using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Net;

public sealed class QualityHeaderTests
{
    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("  ")]
    public void ShouldParseEmptyCollectionIfNullOrWhiteSpace(string value)
        => QualityHeader.Parse(value).Should().BeEmpty();

    [Theory]
    [InlineData("deflate", "deflate")]
    [InlineData("deflate, gzip;q=1.0, *;q=0.5", "deflate", "gzip", "*")]
    [InlineData("fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *", "fr-CH", "fr", "en", "de", "*")]
    [InlineData("de;q=0.7, fr;q=0.9, en;q=0.8, fr-CH, *", "fr-CH", "fr", "en", "de", "*")]
    public void ShouldReturnParsedValues(string input, params string[] expected)
        => QualityHeader.Parse(input).Should().BeEquivalentTo(expected);
}
