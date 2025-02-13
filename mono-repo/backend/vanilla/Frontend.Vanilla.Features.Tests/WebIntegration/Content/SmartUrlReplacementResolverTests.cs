using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebIntegration.Content;
using Microsoft.AspNetCore.Http;
using Moq;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using static System.Net.WebRequestMethods;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Content;

public class SmartUrlReplacementResolverTests
{
    private readonly ISmartUrlReplacementResolver target;
    private readonly Mock<IHttpContextAccessor> httpContextAccessorMock;
    private readonly Mock<IAppDslProvider> appDslProviderMock;

    public SmartUrlReplacementResolverTests()
    {
        httpContextAccessorMock = new Mock<IHttpContextAccessor>();
        appDslProviderMock = new Mock<IAppDslProvider>();

        target = new SmartUrlReplacementResolver(httpContextAccessorMock.Object, appDslProviderMock.Object);
    }

    [Fact]
    public void Resolve_ShouldReturnEmptyString_IfNoProduct()
    {
        IHeaderDictionary headers = new HeaderDictionary();
        headers["Custom-Header"] = "CustomValue";

        httpContextAccessorMock.SetupGet(p => p.HttpContext.Request.Scheme).Returns("https");
        httpContextAccessorMock.SetupGet(p => p.HttpContext.Request.Host).Returns(new HostString("vanilla.com"));
        httpContextAccessorMock.SetupGet(p => p.HttpContext.Request.Headers).Returns(headers);

        var list = new List<string> { string.Empty };

        target.Resolve().Should().BeEquivalentTo(list);
    }

    [Fact]
    public void Resolve_ShouldReturnEmptyString_IfNoHttpContext()
    {
        appDslProviderMock.Setup(x => x.Product).Returns("test");

        target.Resolve().Should().Equal(Enumerable.Empty<string>());
    }

    [Fact]
    public void Resolve_ShouldReturnEncodedSmartUrlReplacement()
    {
        IHeaderDictionary headers = new HeaderDictionary();
        headers["Custom-Header"] = "CustomValue";

        httpContextAccessorMock.SetupGet(p => p.HttpContext.Request.Scheme).Returns("https");
        httpContextAccessorMock.SetupGet(p => p.HttpContext.Request.Host).Returns(new HostString("vanilla.com"));
        httpContextAccessorMock.SetupGet(p => p.HttpContext.Request.Headers).Returns(headers);
        appDslProviderMock.Setup(x => x.Product).Returns("test");

        target.Resolve().Should().Equal(new List<string> { "test%7Chttps%3A%2F%2Fvanilla.com%2F" });
    }

    [Fact]
    public void Resolve_ShouldReturnEncodedSmartUrlsIfSmartUrlPresent()
    {
        httpContextAccessorMock.SetupGet(p => p.HttpContext.Request.Scheme).Returns("https");

        var headers = new HeaderDictionary();
        headers["x-smart-url-casino"] = "casino.bwin.com";
        headers["x-smart-url-sports"] = "sports.bwin.com";
        headers["x-smart-url-portal"] = "www.bwin.com";

        httpContextAccessorMock.SetupGet(p => p.HttpContext.Request.Headers).Returns(headers);
        appDslProviderMock.Setup(x => x.Product).Returns("test");

        target.Resolve().Should().Equal(new List<string> { "casino%7Chttps%3A%2F%2Fcasino.bwin.com%2F", "sports%7Chttps%3A%2F%2Fsports.bwin.com%2F", "portal%7Chttps%3A%2F%2Fwww.bwin.com%2F" });
    }
}
