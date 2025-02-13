using System.Text.RegularExpressions;
using FluentAssertions;
using Frontend.Host.Features.CanonicalLinkTag;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Host.Tests.Features.CanonicalLinkTag;

public class CanonicalConfigurationTests
{
    private string hostAndPathRegex;
    private string canonicalUrl;

    public CanonicalConfigurationTests()
    {
        hostAndPathRegex = "^.*bwin.*$";
        canonicalUrl = "http://www.bwin.com";
    }

    private Func<CanonicalUrlRule> RunTest
        => () => new CanonicalUrlRule(hostAndPathRegex, canonicalUrl);

    [Fact]
    public void ShouldCreateRuleCorrectly()
    {
        var target = RunTest();

        target.HostAndPathRegex.ToString().Should().Be(hostAndPathRegex);
        target.HostAndPathRegex.Options.Should().Be(RegexOptions.Compiled | RegexOptions.IgnoreCase);
        target.CanonicalUrl.Should().Be(canonicalUrl);
    }

    [Fact]
    public void HostAndPathRegex_ShouldThrow_IfNull()
    {
        hostAndPathRegex = null!;
        RunTest.Should().Throw<ArgumentException>()
            .Which.Message.Should().ContainAll("Missing " + nameof(CanonicalUrlRule.HostAndPathRegex), nameof(CanonicalUrlRule.CanonicalUrl), canonicalUrl);
    }

    [Theory]
    [InlineData("bwin.com$", "must match full input")]
    [InlineData("^bwin.com", "must match full input")]
    [InlineData("^(unclosed-group$", "Not enough )'s")]
    public void HostAndPathRegex_ShouldThrow_IfInvalid(string value, string expectedError)
    {
        hostAndPathRegex = value;
        RunTest.Should().Throw<ArgumentException>()
            .Which.Message.Should().ContainAll(nameof(CanonicalUrlRule.HostAndPathRegex), value, expectedError);
    }

    [Fact]
    public void CanonicalUrl_ShouldAllowNull()
    {
        canonicalUrl = null!;

        var target = RunTest(); // Act

        target.CanonicalUrl.Should().BeNull();
    }

    [Theory, ValuesData("", "  ")]
    public void CanonicalUrl_ShouldThrow_IfNullOrWhiteSpace(string value)
    {
        canonicalUrl = value;
        RunTest.Should().Throw<ArgumentException>()
            .Which.Message.Should().ContainAll(nameof(CanonicalUrlRule.CanonicalUrl), $"'{value}'");
    }

    [Theory]
    [InlineData("relative/url")]
    [InlineData("www.without/scheme")]
    [InlineData("ftp://unsupported-scheme")]
    public void CanonicalUrl_ShouldThrow_IfNotValidUrl(string value)
    {
        canonicalUrl = value;
        RunTest.Should().Throw<ArgumentException>()
            .Which.Message.Should().ContainAll("a valid HTTP(S) URL", nameof(CanonicalUrlRule.CanonicalUrl), value);
    }
}
