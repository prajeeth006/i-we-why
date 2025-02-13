using System;
using System.Collections;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Features.App;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebUtilities;

public class BrowserUrlProviderTests
{
    private readonly IBrowserUrlProvider target;
    private readonly Mock<IHttpContextAccessor> httpContextAccessor;
    private readonly Mock<IAppConfiguration> appConfig;
    private readonly TestLogger<BrowserUrlProvider> log;

    public BrowserUrlProviderTests()
    {
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        appConfig = new Mock<IAppConfiguration>();
        log = new TestLogger<BrowserUrlProvider>();
        target = new BrowserUrlProvider(httpContextAccessor.Object, appConfig.Object, log);

        httpContextAccessor.SetupGet(r => r.HttpContext.Request.Scheme).Returns("http");
        httpContextAccessor.SetupGet(r => r.HttpContext.Request.Host).Returns(new HostString("bwin.com"));
        httpContextAccessor.SetupGet(r => r.HttpContext.Request.Path).Returns("/request/url");
        httpContextAccessor.SetupGet(r => r.HttpContext.Request.QueryString).Returns(new QueryString("?q=1"));
        httpContextAccessor.SetupGet(r => r.HttpContext.Request.Headers).Returns(new HeaderDictionary());
        httpContextAccessor.SetupGet(r => r.HttpContext.Request.Query).Returns(new QueryCollection(new Dictionary<string, StringValues>()));

        var serviceProviderMock = new Mock<IServiceProvider>();
        serviceProviderMock.Setup(x => x.GetService(typeof(IRequestScopedValuesProvider))).Returns(new RequestScopedValuesProvider());
        httpContextAccessor.Setup(c => c.HttpContext.RequestServices).Returns(serviceProviderMock.Object);
    }

    public static readonly IEnumerable TestUrls = new[] { "http://www.bwin.com/test?q=1", "https://www.bwin.com/test?q=1" };

    [Theory, MemberValuesData(nameof(TestUrls))]
    public void Url_ShouldRetrieveFromQueryParameter(string url)
    {
        SetupUrlInQuery(url);
        ExpectUrlWithoutRedirect(url);
    }

    [Theory, MemberValuesData(nameof(TestUrls))]
    public void Url_ShouldRetrieveFromHeader(string url)
    {
        SetupUrlInHeader(url);
        ExpectUrlWithoutRedirect(url);
    }

    [Theory]
    [InlineData(false, "http", "http://bwin.com/request/url?q=1")]
    [InlineData(false, "https", "https://bwin.com/request/url?q=1")] // Don't enforce http if actual request is https
    [InlineData(true, "http", "https://bwin.com/request/url?q=1")]
    [InlineData(true, "https", "https://bwin.com/request/url?q=1")]
    public void Url_ShouldFallbackToRequestUrl(bool usesHttps, string scheme, string expectedUrl)
    {
        appConfig.SetupGet(c => c.UsesHttps).Returns(usesHttps);
        httpContextAccessor.SetupGet(r => r.HttpContext.Request.Scheme).Returns(scheme);
        ExpectUrlWithoutRedirect(expectedUrl);
    }

    private void ExpectUrlWithoutRedirect(string expected)
    {
        target.Url.Should().Be(new HttpUri(expected));
        target.PendingRedirect.Should().BeNull();
    }

    [Fact]
    public void PendingRedirect_ShouldBeNullByDefault()
        => target.PendingRedirect.Should().BeNull();

    [Theory]
    [MemberData(nameof(GetEnqueueRedirectTestCases))]
    public void EnqueueRedirect_ShouldSetUrl(string urlStr, bool redirectIsExpected, bool permanent)
    {
        var url = new HttpUri(urlStr);

        // Act
        target.EnqueueRedirect(url, permanent);

        target.Url.Should().Be(url);
        target.PendingRedirect.Should().BeEquivalentTo(redirectIsExpected ? new BrowserUrlRedirect(url, permanent) : null);
    }

    public static IEnumerable<object[]> GetEnqueueRedirectTestCases()
    {
        object[] GetTestCase(string urlStr, bool redirectIsExpected, bool permanent) =>
            new object[] { urlStr, redirectIsExpected, permanent };

        yield return GetTestCase("http://bwin.com/new/url?q=1", true, true);
        yield return GetTestCase("http://bwin.com/new/url?q=1", true, false);
        yield return GetTestCase("http://bwin.com/request/url?q=1", false, true);
        yield return GetTestCase("http://bwin.com/request/url?q=1", false, false);

        // multiple query parameters
        yield return GetTestCase("http://bwin.com/new/url?a=b&b=c", true, true);
        yield return GetTestCase("http://bwin.com/new/url?a=b&b=c", true, false);
        yield return GetTestCase("http://bwin.com/request/url?a=b&b=c", true, true);
        yield return GetTestCase("http://bwin.com/request/url?a=b&b=c", true, false);

        // url encoding is used
        yield return GetTestCase("http://example.org?a=some%20text%20with%20spaces%20and%20%2F&b=c", true, false);
        yield return GetTestCase(
            "http://example.org?a=https%3A%2F%2Fqa1.promo.bwin.com%2Fen%2Fpromo%2Fep%2Fc%2Fcoinfliptest%3Fpromoid%3D19491%26promotype%3Dflip_a_coin%26_mode%3Dpreview",
            true,
            false);

        // D-108060
        yield return GetTestCase(
            "https://qa1.promo.bwin.com/en/labelhost/login?rurl=https:%2F%2Fqa1.promo.bwin.com%2Fen%2Fpromo%2Fep%2Fc%2Fcoinfliptest%3Fpromoid%3D19491%26promotype%3Dflip_a_coin%26_mode%3Dpreview&promoid=19491&promotype=flip_a_coin&_mode=preview",
            true,
            false);
    }

    [Fact]
    public void EnqueueRedirect_ShouldBeTemporary_IfOneTemporary()
    {
        // Act
        target.EnqueueRedirect(new HttpUri("http://permanent-1/"), permanent: true);
        target.EnqueueRedirect(new HttpUri("http://temporary/"));
        target.EnqueueRedirect(new HttpUri("http://permanent-2/"), permanent: true);

        target.Url.Should().Be(new HttpUri("http://permanent-2/"));
        target.PendingRedirect.Should().BeEquivalentTo(new BrowserUrlRedirect(new HttpUri("http://permanent-2/"), false));
    }

    [Fact]
    public void EnqueueRedirect_ShouldNotRedirect_IfBackToOriginal()
    {
        target.EnqueueRedirect(new HttpUri("http://away/from/original"));

        // Act
        target.EnqueueRedirect(new HttpUri("http://bwin.com/request/url?q=1"));

        ExpectUrlWithoutRedirect("http://bwin.com/request/url?q=1");
    }

    [Fact]
    public void EnqueueRedirect_ShouldThrow_IfRetrievedFromQueryParameter()
    {
        SetupUrlInQuery("https://whatever/");
        RunFailedEnqueueRedirectTest();
    }

    [Fact]
    public void EnqueueRedirect_ShouldSupportUrlFromQueryParameter_IfDiagnosticApi()
    {
        SetupUrlInQuery("https://whatever/");
        httpContextAccessor.SetupGet(r => r.HttpContext.Request.Path).Returns("/" + DiagnosticApiUrls.Dsl.ExpressionTest.UrlTemplate);

        // Act
        target.EnqueueRedirect(new HttpUri("http://bwin.com/new/url?q=1"));

        target.PendingRedirect.Should().BeEquivalentTo(new BrowserUrlRedirect(new HttpUri("http://bwin.com/new/url?q=1"), false));
    }

    [Fact]
    public void EnqueueRedirect_ShouldThrow_IfRetrievedFromHeader()
    {
        SetupUrlInHeader("https://whatever/");
        RunFailedEnqueueRedirectTest();
    }

    private void RunFailedEnqueueRedirectTest()
    {
        var url = new HttpUri("http://bwin.com/new/url?q=1");

        var act = () => target.EnqueueRedirect(url);

        act.Should().Throw()
            .Which.Message.Should().ContainAll("redirect", "document request");
    }

    private void SetupUrlInHeader(string url)
        => httpContextAccessor.SetupGet(r => r.HttpContext.Request.Headers)
            .Returns(new HeaderDictionary { { HttpHeaders.XBrowserUrl, url } });

    private void SetupUrlInQuery(string url)
        => httpContextAccessor.SetupGet(r => r.HttpContext.Request.Query)
            .Returns(new QueryCollection(new Dictionary<string, StringValues> { { BrowserUrlProvider.QueryParameter, url } }));
}
