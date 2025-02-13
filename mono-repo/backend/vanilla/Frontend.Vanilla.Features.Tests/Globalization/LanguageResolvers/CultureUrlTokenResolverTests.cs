using System;
using FluentAssertions;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.Routing;
using Frontend.Vanilla.Features.Tests.Fakes;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.LanguageResolvers;

public class CultureUrlTokenResolverTests
{
    private ICultureUrlTokenResolver target;
    private DefaultHttpContext httpContext;

    private readonly Mock<IGlobalizationConfiguration> config;
    private readonly Mock<IInternalLanguagesResolver> internalLanguagesResolver;

    public CultureUrlTokenResolverTests()
    {
        var allowedLang1 = TestLanguageInfo.Get("qq", routeValue: "qq");
        var allowedLang2 = TestLanguageInfo.Get("rv", routeValue: "rv");
        var offlineLang = TestLanguageInfo.Get("of", routeValue: "of");
        var internalLang = TestLanguageInfo.Get("in", routeValue: "in");

        config = new Mock<IGlobalizationConfiguration>();
        config.SetupGet(c => c.AllowedLanguages).Returns(new[] { allowedLang1, allowedLang2 });
        config.SetupGet(c => c.OfflineLanguages).Returns(new[] { offlineLang });

        internalLanguagesResolver = new Mock<IInternalLanguagesResolver>();
        internalLanguagesResolver.Setup(r => r.Resolve()).Returns(new[] { internalLang });

        target = new CultureUrlTokenResolver(config.Object, internalLanguagesResolver.Object);
        httpContext = new DefaultHttpContext();

        httpContext.Request.Scheme = "http";
        httpContext.Request.Host = new HostString("bwin.com");
        httpContext.Request.Path = "/en/page";
        httpContext.Request.QueryString = new QueryString("?q=1");
    }

    [Theory]
    [InlineData("qq", "rv", "qq", CultureUrlTokenSource.UrlQuery)]
    [InlineData("qq", null, "qq", CultureUrlTokenSource.UrlQuery)]
    [InlineData("  ", "rv", "rv", CultureUrlTokenSource.RouteValues)]
    [InlineData("", "rv", "rv", CultureUrlTokenSource.RouteValues)]
    [InlineData(null, "rv", "rv", CultureUrlTokenSource.RouteValues)]
    [InlineData(null, "  ", null, null)]
    [InlineData(null, "", null, null)]
    [InlineData(null, null, null, null)]
    internal void GetToken_ShouldGetFromQuery(string queryParam, string routeValue, string expectedToken, CultureUrlTokenSource? expectedSource)
    {
        if (queryParam != null) httpContext.Request.SetQuery((RouteValueKeys.Culture, queryParam));
        if (routeValue != null) httpContext.Request.RouteValues[RouteValueKeys.Culture] = routeValue;

        // Act
        var result = target.GetToken(httpContext);

        result.Token.Should().Be(expectedToken);
        result.Source.Should().Be(expectedSource);
    }

    [Fact]
    public void GetToken_ShouldThrow_IfRouteValueNotString()
    {
        httpContext.Request.RouteValues[RouteValueKeys.Culture] = 123;

        target.Invoking(t => t.GetToken(httpContext))
            .Should().Throw<InvalidCastException>();
    }

    [Fact]
    public void GetUrlWithCultureToken_ShouldChangeInQueryString()
    {
        httpContext.Request.QueryString = new QueryString("?q=1&culture=qq");

        // Act
        var url = target.GetUrlWithCultureToken(httpContext, "xyz");

        url.Should().Be(new Uri("http://bwin.com/en/page?q=1&culture=xyz"));
    }

    [Theory]
    [InlineData("/rv", "/xyz")]
    [InlineData("/rv/page", "/xyz/page")]
    [InlineData("/sports/rv/page", "/sports/xyz/page")]
    public void GetUrlWithCultureToken_ShouldChangeInRouteValues(string requestPath, string expectedPath)
    {
        httpContext.Request.RouteValues[RouteValueKeys.Culture] = "rv";
        httpContext.Request.Path = requestPath;

        // Act
        var url = target.GetUrlWithCultureToken(httpContext, "xyz");

        url.Should().Be(new Uri($"http://bwin.com{expectedPath}?q=1"));
    }
}
