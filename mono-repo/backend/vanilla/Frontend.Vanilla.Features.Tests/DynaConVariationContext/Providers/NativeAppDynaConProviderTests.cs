using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.DynaConVariationContext.Providers;
using Frontend.Vanilla.Features.NativeApp;
using Frontend.Vanilla.Testing;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DynaConVariationContext.Providers;

public class NativeAppDynaConProviderTests : DynaConProviderTestsBase
{
    private readonly Mock<ICookieHandler> cookieHandlerAdapter;
    private readonly Mock<IHttpContextAccessor> httpContextAccessorMock;

    public NativeAppDynaConProviderTests()
    {
        cookieHandlerAdapter = new Mock<ICookieHandler>();
        httpContextAccessorMock = new Mock<IHttpContextAccessor>();
        Target = new NativeAppDynaConProvider(cookieHandlerAdapter.Object, httpContextAccessorMock.Object);
    }

    [Fact]
    public void GetCurrentRawValue_ShouldGetFromQuery()
    {
        httpContextAccessorMock.SetupGet(p => p.HttpContext.Request.Query).Returns(
            new QueryCollection(new Dictionary<string, StringValues> { [NativeAppConstants.QueryParameter] = "Sports" }));
        Target.GetCurrentRawValue().Should().Be("Sports");
    }

    [Fact]
    public void GetCurrentRawValue_ShouldGetRequestParameter()
    {
        cookieHandlerAdapter.Setup(p => p.GetValue(NativeAppConstants.CookieName)).Returns("Casino");
        Target.GetCurrentRawValue().Should().Be("Casino");
    }
}
