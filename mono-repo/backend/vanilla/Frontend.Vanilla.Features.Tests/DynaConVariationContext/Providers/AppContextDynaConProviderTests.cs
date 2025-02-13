using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.DynaConVariationContext.Providers;
using Frontend.Vanilla.Testing;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DynaConVariationContext.Providers;

public class AppContextDynaConProviderTests : DynaConProviderTestsBase
{
    private readonly Mock<IHttpContextAccessor> httpContextAccessorMock;

    public AppContextDynaConProviderTests()
    {
        httpContextAccessorMock = new Mock<IHttpContextAccessor>();
        Target = new AppContextDynaConProvider(httpContextAccessorMock.Object);
    }

    [Fact]
    public void GetCurrentRawValue_ShouldComeFromDefaultValueWhenNoHeader()
    {
        Target.GetCurrentRawValue().Should().Be("default");
    }

    [Fact]
    public void GetCurrentRawValue_ShouldComeFromXAppContextHeader()
    {
        httpContextAccessorMock.SetupGet(p => p.HttpContext.Request.Headers[HttpHeaders.XAppContext]).Returns("iframe");

        Target.GetCurrentRawValue().Should().Be("iframe");
    }

    [Fact]
    public void GetCurrentRawValue_ShouldComeFromDefaultValueWhenSecFetchDestHeaderValueIsNotIframe()
    {
        httpContextAccessorMock.SetupGet(p => p.HttpContext.Request.Headers[HttpHeaders.SecFetchDest]).Returns("empty");

        Target.GetCurrentRawValue().Should().Be("default");
    }

    [Fact]
    public void GetCurrentRawValue_ShouldComeFromSecFetchDestHeaderIfValueIsIframe()
    {
        httpContextAccessorMock.SetupGet(p => p.HttpContext.Request.Headers[HttpHeaders.SecFetchDest]).Returns("iframe");

        Target.GetCurrentRawValue().Should().Be("iframe");
    }
}
