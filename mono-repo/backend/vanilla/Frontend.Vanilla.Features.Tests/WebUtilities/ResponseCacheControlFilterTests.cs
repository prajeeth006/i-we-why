using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.EntryWeb.Headers;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using Microsoft.Net.Http.Headers;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebUtilities;

public class ResponseCacheControlCoreAttributeTests
{
    private readonly ResponseCacheControlCoreAttribute target;
    private readonly ActionContext actionContext;
    private readonly ActionExecutedContext actionExecutedContext;
    private readonly Mock<IHeadersConfiguration> headersConfig;
    private readonly Mock<HttpRequest> httpRequest;

    public ResponseCacheControlCoreAttributeTests()
    {
        target = new ResponseCacheControlCoreAttribute();
        headersConfig = new Mock<IHeadersConfiguration>();

        httpRequest = new Mock<HttpRequest>();
        httpRequest.SetupGet(x => x.Method).Returns("GET");
        httpRequest.SetupGet(x => x.Scheme).Returns("https");
        httpRequest.SetupGet(x => x.Host).Returns(new HostString("testweb.vanilla.intranet"));
        httpRequest.SetupGet(x => x.Path).Returns("/test");
        httpRequest.SetupGet(x => x.PathBase).Returns("");
        httpRequest.SetupGet(x => x.QueryString).Returns(new QueryString("?configNames=vnLazyFeatures"));

        var response = Mock.Of<HttpResponse>(x => x.Headers == new HeaderDictionary() { { "cache-control", "no-cache" } });

        var httpContext = Mock.Of<HttpContext>(x =>
            x.Request == httpRequest.Object && x.Response == response && x.RequestServices.GetService(typeof(IHeadersConfiguration)) == headersConfig.Object);

        actionContext = new ActionContext(httpContext, Mock.Of<RouteData>(), Mock.Of<ActionDescriptor>());
        actionExecutedContext = new ActionExecutedContext(actionContext, new List<IFilterMetadata>(), Mock.Of<Controller>());
    }

    [Theory]
    [InlineData("/test", "?configNames=vnLazyFeatures", "/test?configNames=vnLazyFeatures", "public, max-age=600", "public, max-age=600")]
    [InlineData("/test", "?configNames=vnLazyFeatures", "/test?configNames=*", "public, max-age=500", "public, max-age=500")]
    [InlineData("/test",
        "?configNames=vnLazyFeatures&cookie=x",
        "/test?cookie=x&configNames=vnLazyFeatures",
        "public, max-age=500",
        "public, max-age=500")] // Params with different order
    [InlineData("/test",
        "?configNames=vnLazyFeatures&cookie=x",
        "/test?configNames=vnLazyFeatures",
        "public, max-age=500",
        "public, max-age=500")] // Partial param configured
    [InlineData("/test", "?configNames=vnLazyFeatures", "/test?configNames=vnPage", "public, max-age=400", "no-cache")]
    [InlineData("/test", "?configNames=vnLazyFeatures", "/anotherpath?configNames=vnLazyFeatures", "public, max-age=300", "no-cache")]
    [InlineData("/test", "?configNames=vnLazyFeatures", "/test?configNames=vnLazyFeatures&cookie=x", "public, max-age=600", "no-cache")]
    [InlineData("/test", "?configNames=vnLazyFeatures", "/test", "public, max-age=600", "public, max-age=600")]
    [InlineData("/en/pathwithduplicatedsegment/en/test", "", "/test", "public, max-age=600", "public, max-age=600")]
    public void ShouldSetCorrectCacheHeaders(string requestPath, string requestQueryString, string configPathAndQuery, string cacheHeader, string expectedHeader)
    {
        httpRequest.SetupGet(x => x.Path).Returns(requestPath);
        httpRequest.SetupGet(x => x.QueryString).Returns(new QueryString(requestQueryString));

        headersConfig.Setup(x => x.ClientResponseCacheControl).Returns(new Dictionary<string, string> { { configPathAndQuery, cacheHeader } });
        target.OnActionExecuted(actionExecutedContext); // Act

        actionContext.HttpContext.Response.GetTypedHeaders().CacheControl.Should().Be(CacheControlHeaderValue.Parse(expectedHeader));
    }

    [Fact]
    public void ShouldConfigWithoutQueryStringOverrideOthers()
    {
        var config = new Dictionary<string, string>
        {
            { "/partial?configNames=vnLazyFeatures", "public, max-age=100" },
            { "/partial", "public, max-age=200" },
            { "/partial?configNames=*", "public, max-age=300" },
            { "/test?configNames=vnLazyFeatures", "public, max-age=100" },
            { "/test", "public, max-age=200" },
            { "/test?configNames=*", "public, max-age=300" },
        };

        headersConfig.Setup(x => x.ClientResponseCacheControl).Returns(config);
        target.OnActionExecuted(actionExecutedContext); // Act

        actionContext.HttpContext.Response.GetTypedHeaders().CacheControl.Should().Be(CacheControlHeaderValue.Parse("public, max-age=200"));
    }

    [Fact]
    public void ShouldConfigWithWildCardOverrideOthersWithSameQueryParams()
    {
        var config = new Dictionary<string, string>
        {
            { "/partial?configNames=*", "public, max-age=100" },
            { "/partial?configNames=vnLazyFeatures", "public, max-age=200" },
            { "/partial?configNames=vnLazyFeatures&cookie=a", "public, max-age=300" },
            { "/test?configNames=*", "public, max-age=400" },
            { "/test?configNames=vnLazyFeatures", "public, max-age=500" },
            { "/test?configNames=vnLazyFeatures&cookie=a", "public, max-age=600" },
        };

        headersConfig.Setup(x => x.ClientResponseCacheControl).Returns(config);
        target.OnActionExecuted(actionExecutedContext); // Act

        actionContext.HttpContext.Response.GetTypedHeaders().CacheControl.Should().Be(CacheControlHeaderValue.Parse("public, max-age=400"));
    }

    [Theory]
    [InlineData("?configNames=vnLazyFeatures&cookie=a", "public, max-age=100")]
    [InlineData("?configNames=vnLazyFeatures&cookie=b", "private, max-age=200")]
    [InlineData("?configNames=vnLazyFeatures&cookie=b&item=test", "private, max-age=200")]
    public void ShouldApplyCorrectConfigWhenSameQueryParamsHaveDifferentValues(string requestQuery, string expected)
    {
        httpRequest.SetupGet(x => x.QueryString).Returns(new QueryString(requestQuery));
        var config = new Dictionary<string, string>
        {
            { "/test?configNames=vnLazyFeatures&cookie=a", "public, max-age=100" },
            { "/test?configNames=vnLazyFeatures&cookie=b", "private, max-age=200" },
        };

        headersConfig.Setup(x => x.ClientResponseCacheControl).Returns(config);
        target.OnActionExecuted(actionExecutedContext); // Act

        actionContext.HttpContext.Response.GetTypedHeaders().CacheControl.Should().Be(CacheControlHeaderValue.Parse(expected));
    }

    [Theory]
    [MemberData(nameof(CacheConfigData))]
    public void ShouldSetCorrectCacheHeadersMultipleConfigs(string requestPath, string requestQueryString, Dictionary<string, string> config, string expectedHeader)
    {
        httpRequest.SetupGet(x => x.Path).Returns(requestPath);
        httpRequest.SetupGet(x => x.QueryString).Returns(new QueryString(requestQueryString));

        headersConfig.Setup(x => x.ClientResponseCacheControl).Returns(config);
        target.OnActionExecuted(actionExecutedContext); // Act

        actionContext.HttpContext.Response.GetTypedHeaders().CacheControl.Should().Be(CacheControlHeaderValue.Parse(expectedHeader));
        actionContext.HttpContext.Response.Headers.Vary.Should().BeEquivalentTo(new[] { HttpHeaders.AcceptEncoding, HttpHeaders.NativeApp });
    }

    public static IEnumerable<object[]> CacheConfigData => new[]
    {
        new object[]
        {
            "/widget/widgetdata",
            "?layoutSize=Large&page=HomeLobby&widgetId=/mobilesports-v1.0/layout/layout_europe_uk/modules/marquee_secondrow&shouldIncludePayload=true&marqueesOnly=true&isPersonalized=true&forceFresh=1",
            new Dictionary<string, string>
            {
                { "/widgetdata?shouldIncludePayload=true&isPersonalized=true", "no-store, no-cache" },
                { "/widgetdata?shouldIncludePayload=true", "public, max-age=100" },
            },
            "no-store, no-cache",
        },
        new object[]
        {
            "/widget/widgetdata",
            "?layoutSize=Large&page=HomeLobby&widgetId=/mobilesports-v1.0/layout/layout_standards/modules/upcominggrid&shouldIncludePayload=true&forceFresh=1",
            new Dictionary<string, string>
            {
                { "/widgetdata?shouldIncludePayload=true&isPersonalized=true", "no-store, no-cache" },
                { "/widgetdata?shouldIncludePayload=true", "public, max-age=100" },
            },
            "public, max-age=100",
        },
        new object[]
        {
            "/widget/widgetdata",
            "?layoutSize=Large&page=HomeLobby&widgetId=/mobilesports-v1.0/layout/layout_standards/modules/upcominggrid&shouldIncludePayload=true&forceFresh=1",
            new Dictionary<string, string>
            {
                { "/widget/widgetdata?shouldIncludePayload=true", "public, max-age=15" },
                { "/widget?page=*", "private, max-age=2, stale-while-revalidate=15" },
            },
            "public, max-age=15",
        },
        new object[]
        {
            "/widget",
            "?page=HomeLobby&widgetId=/mobilesports-v1.0/layout/layout_standards/modules/upcominggrid&shouldIncludePayload=true&forceFresh=1",
            new Dictionary<string, string>
            {
                { "/widget/widgetdata?shouldIncludePayload=true", "public, max-age=15" },
                { "/widget?page=*", "private, max-age=2, stale-while-revalidate=15" },
            },
            "private, max-age=2, stale-while-revalidate=15",
        },
    };
}
