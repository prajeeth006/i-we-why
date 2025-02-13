using FluentAssertions;
using Frontend.Host.Features.CanonicalLinkTag;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.CanonicalLinkTag;

public class CanonicalLinkTagServiceTests : IDisposable
{
    private ICanonicalLinkTagService target;
    private Mock<ICanonicalConfiguration> config;
    private Mock<IInternalRequestEvaluator> internalRequestEvaluator;
    private TestLogger<CanonicalLinkTagService> log;

    public CanonicalLinkTagServiceTests()
    {
        config = new Mock<ICanonicalConfiguration>();
        internalRequestEvaluator = new Mock<IInternalRequestEvaluator>();
        log = new TestLogger<CanonicalLinkTagService>();
        target = new CanonicalLinkTagService(config.Object, internalRequestEvaluator.Object, log);

        config.SetupGet(c => c.QueryStringsToKeep).Returns(new[] { "a", "b" });
        config.SetupGet(c => c.UrlRegexRules).Returns(new Dictionary<string, CanonicalUrlRule>());
    }

    [Theory]
    [InlineData("http://sports.bwin.es/", "https://sports.bwin.es")]
    [InlineData("http://sports2.bwin.es/path/", "https://sports2.bwin.es/path")]
    [InlineData("http://www.google.com/en/account", "https://www.google.com/en/account")]
    [InlineData("http://anydomain.net/en/account/recovery?trid=55", "https://anydomain.net/en/account/recovery")]
    [InlineData("http://something-1.com/en/account/recovery?a=1&trid=55&b=22", "https://something-1.com/en/account/recovery?a=1&amp;b=22")]
    [InlineData("http://foo.com/path?X=1&Y=2&Z=3&Q=Y#fragment", "https://foo.com/path")]
    [InlineData("http://foo.com/path?A=1&b=2&C=3&x=Y#fragment", "https://foo.com/path?a=1&amp;b=2")]
    public void DomainNotFoundInConfiguration_QueryParametersProcessed(string requestUrl, string expectedUrl)
        => RunRenderCanonicalTag(requestUrl, expectedUrl);

    [Theory]
    [InlineData("http://sports45.bwin.es/", "https://sports.bwin.es")]
    [InlineData("http://dev.sports25.bwin.es/", "https://sports.bwin.es")]
    [InlineData("http://www3.bwin.es/?A=1&b=2&C=3&x=Y#fragment", "https://www.bwin.es/?a=1&amp;b=2")]
    [InlineData("http://no-match.bwin.com/?A=1&b=2&C=3&x=Y#fragment", "https://www.bwin.com/?a=1&amp;b=2")]
    public void DomainExistsInConfiguration_HostAndQueryParametersProcessed(string requestUrl, string expectedUrl)
    {
        config.SetupGet(c => c.UrlRegexRules).Returns(new Dictionary<string, CanonicalUrlRule>
        {
            { "rule1", new CanonicalUrlRule(@"^(.*?)sports[^.]*\.bwin\.es(.*)$", @"https://sports.bwin.es$2") },
            { "rule2", new CanonicalUrlRule(@"^(.*?)www3\.bwin\.es(.*)$", @"https://www.bwin.es$2") },
            { "rule3", new CanonicalUrlRule(@"^(.*?)\.bwin\.com(.*)$", @"https://www.bwin.com$2") },
        });
        RunRenderCanonicalTag(requestUrl, expectedUrl);
    }

    [Theory]
    [InlineData("http://www3.bwin.es", "https://www.bwin.es")]
    [InlineData("https://sports.bwin.es/path?D=1&E=2&C=3&x=Y#fragment", "https://sports.bwin.es/path")]
    [InlineData("http://sports3.bwin.es/path/?D=1&F=2&C=3&x=Y#fragment", "https://sports.bwin.es/path")]
    [InlineData("https://no-match.bwin.com/path?D=1&E=2&C=3&x=Y#fragment", "https://www.bwin.com/path")]
    [InlineData("http://no-match.com/path/?C=1", "https://no-match.com/path")]
    [InlineData("https://sports.bwin.es/café", "https://sports.bwin.es/caf%c3%a9")]
    public void NoCanonicalQueryStringParametersAreConfigured_HostProcessedQueryParametersStripped(string requestUrl, string expectedUrl)
    {
        config.SetupGet(c => c.UrlRegexRules).Returns(new Dictionary<string, CanonicalUrlRule>
        {
            { "rule1", new CanonicalUrlRule(@"^(.*?)sports[^.]*\.bwin\.es(.*)$", @"https://sports.bwin.es$2") },
            { "rule2", new CanonicalUrlRule(@"^(.*?)www3\.bwin\.es(.*)$", @"https://www.bwin.es$2") },
            { "rule3", new CanonicalUrlRule(@"^(.*?)\.bwin\.com(.*)$", @"https://www.bwin.com$2") },
        });
        RunRenderCanonicalTag(requestUrl, expectedUrl);
    }

    [Theory]
    [InlineData("http://sports45.bwin.es/", "https://sports.bwin.es")]
    [InlineData("http://sports2.bwin.es/path/", "https://sports.bwin.es/path")]
    [InlineData("http://no-match.com/path/?unknownParam=1", "https://no-match.com/path")]
    [InlineData("http://www3.bwin.es/?A=1&b=2&C=3&x=Y#fragment", "https://www.bwin.es/?a=1&amp;b=2")]
    [InlineData("http://no-match.bwin.com/path/?A=1&b=2&C=3&x=Y#fragment", "https://www.bwin.com/path?a=1&amp;b=2")]
    public void UrlWithTrailingSlashInThePath_TrailingSlashAlwaysRemoved(string requestUrl, string expectedUrl)
    {
        config.SetupGet(c => c.UrlRegexRules).Returns(new Dictionary<string, CanonicalUrlRule>
        {
            { "rule1", new CanonicalUrlRule(@"^(.*?)sports[^.]*\.bwin\.es(.*)$", @"https://sports.bwin.es$2") },
            { "rule2", new CanonicalUrlRule(@"^(.*?)www3\.bwin\.es(.*)$", @"https://www.bwin.es$2") },
            { "rule3", new CanonicalUrlRule(@"^(.*?)\.bwin\.com(.*)$", @"https://www.bwin.com$2") },
        });
        RunRenderCanonicalTag(requestUrl, expectedUrl);
    }

    [Fact]
    public void ShouldReturnNull_IfOptOutRule()
    {
        config.SetupGet(c => c.UrlRegexRules).Returns(new Dictionary<string, CanonicalUrlRule>
            { { "rule1", new CanonicalUrlRule(@"^(.*?).*bwin.*$", canonicalUrl: null) } });
        RunRenderCanonicalTag("http://www.bwin.com", expectedUrl: null!);
    }

    private void RunRenderCanonicalTag(string requestUrl, string expectedUrl)
    {
        var html = target.Render(new HttpUri(requestUrl)); // Act

        html?.Should().Be(expectedUrl != null ? $@"<link rel=""canonical"" href=""{expectedUrl}"" />" : null);
        log.VerifyNothingLogged();
    }

    [Fact]
    public void ShouldHandleExceptions()
    {
        var requestUrl = new HttpUri("http://www.bwin.com/en/page");
        config.SetupGet(c => c.UrlRegexRules).Returns(new Dictionary<string, CanonicalUrlRule>
        {
            { "rule1", new CanonicalUrlRule("^.*party.*$", "http://irrelevant") },
            { "rule2", new CanonicalUrlRule("^.*bwin.*$", "http://this-will-fail-bc-missing-group-$1") },
        });

        var html = target.Render(requestUrl); // Act

        html.Should().BeNull();
        log.Logged.Should().HaveCount(1);
        log.Logged[0].Level.Should().Be(LogLevel.Error);
        log.Logged[0].Exception.Should().NotBeNull();
        var expect = new Dictionary<string, dynamic>
        {
            { "requestUrl", requestUrl },
            { "@rule", config.Object.UrlRegexRules["rule2"] },
        };
        log.Logged[0].Data.Should().BeEquivalentTo(expect);
    }

    [Theory]
    [InlineData("http://casino.bwin.com", @"<link rel=""canonical"" href=""https://sports.bwin.com"" />"
                                          + @"<!-- Canonical link tag diagnostics: Succeeded canonization of http://casino.bwin.com/ using rule /^.*(bwin\.com)$/ to https://sports.$1 with result https://sports.bwin.com. -->")]
    [InlineData("http://partycasino.net", @"<link rel=""canonical"" href=""https://partycasino.net"" />"
                                          + @"<!-- Canonical link tag diagnostics: Succeeded canonization of http://partycasino.net/ using rule (default, no configured rule matched) with result https://partycasino.net. -->")]
    [InlineData("http://sports.coral.com",
        @"<!-- Canonical link tag diagnostics: Opted-out canonization of http://sports.coral.com/ using rule /^.*(coral\.com)$/ to null with result null. -->")]
    public void ShouldOutputDiagnosticInfo_IfInternalRequest(string requestUrl, string expectedHtml)
    {
        internalRequestEvaluator.Setup(e => e.IsInternal()).Returns(true);
        config.SetupGet(c => c.UrlRegexRules).Returns(new Dictionary<string, CanonicalUrlRule>
        {
            { "rule1", new CanonicalUrlRule(@"^.*(bwin\.com)$", "https://sports.$1") },
            { "rule2", new CanonicalUrlRule(@"^.*(coral\.com)$", null) },
        });

        var html = target.Render(new HttpUri(requestUrl)); // Act

        html.Should().Be(expectedHtml);
    }

    [Fact]
    public void ShouldOutputDiagnosticInfo_IfInternalRequest_AndFailed()
    {
        internalRequestEvaluator.Setup(e => e.IsInternal()).Returns(true);
        config.SetupGet(c => c.UrlRegexRules).Throws(new Exception("Oups"));

        var html = target.Render(new HttpUri("http://casino.bwin.com")); // Act

        html.Should().StartWith(
            "<!-- Canonical link tag diagnostics: Failed canonization of http://casino.bwin.com/ using rule (default, no configured rule matched) with result System.Exception: Oups");
    }

    public void Dispose() => internalRequestEvaluator.Verify(e => e.IsInternal(), Times.AtMostOnce);
}
