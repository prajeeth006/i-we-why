using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.Features.WebIntegration.Core.Labels;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Configuration.DynaCon;

public class CurrentProductResolverTests
{
    private ICurrentProductResolver target;
    private Mock<IHttpContextAccessor> httpContextAccessor;
    private Mock<ISingleDomainHostPathResolver> singleDomainHostPathResolver;
    private Mock<IDynaConParameterExtractor> dynaConParameterExtractor;
    private HttpContext httpContext;

    public CurrentProductResolverTests()
    {
        dynaConParameterExtractor = new Mock<IDynaConParameterExtractor>();
        singleDomainHostPathResolver = new Mock<ISingleDomainHostPathResolver>();
        dynaConParameterExtractor.SetupGet(p => p.Product).Returns("shared-features");
        httpContext = new DefaultHttpContext();
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        httpContextAccessor.SetupGet(p => p.HttpContext).Returns(httpContext);
        target = new CurrentProductResolver(dynaConParameterExtractor.Object, singleDomainHostPathResolver.Object, httpContextAccessor.Object);
    }

    [Fact]
    public void ProductLegacy_ShouldReturnFromHeader()
    {
        httpContext.Request.Headers[HttpHeaders.XFromProduct] = "portal";
        target.ProductLegacy.Should().Be("portal");
    }

    [Fact]
    public void ProductLegacy_ShouldFallbackToDynaconProduct()
    {
        httpContext.Request.Headers[HttpHeaders.XFromProduct] = "";
        target.ProductLegacy.Should().Be("shared-features");
    }

    [Fact]
    public void Product_ShouldBeTakenFromHeader()
    {
        httpContext.Request.Headers[HttpHeaders.XFromProduct] = CurrentProductResolver.HostAppProduct;
        httpContext.Request.Headers[HttpHeaders.XBrowserUrl] = "https://www.bwin.com/en/games";
        singleDomainHostPathResolver.Setup(s => s.ResolveProduct(httpContext)).Returns("casino");

        target.Product.Should().Be("casino");
    }

    [Fact]
    public void Product_ShouldBeTakenFromContext()
    {
        httpContext.Request.Headers[HttpHeaders.XFromProduct] = CurrentProductResolver.HostAppProduct;
        httpContext.Request.Path = "/en/promo/offers";
        singleDomainHostPathResolver.Setup(s => s.ResolveProduct(httpContext)).Returns("promo");

        target.Product.Should().Be("promo");
    }

    [Fact]
    public void Product_ShouldReturnDefaultValueForSingleDomainIfPathDoesNotExist()
    {
        httpContext.Request.Headers[HttpHeaders.XFromProduct] = CurrentProductResolver.HostAppProduct;
        httpContext.Request.Path = "/en/foo/bar";
        singleDomainHostPathResolver.Setup(s => s.ResolveProduct(httpContext)).Returns("sports");

        target.Product.Should().Be("sports");
    }
}
