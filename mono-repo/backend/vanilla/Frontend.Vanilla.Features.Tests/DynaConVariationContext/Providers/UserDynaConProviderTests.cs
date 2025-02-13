using System.Collections.Generic;
using System.Security.Claims;
using FluentAssertions;
using Frontend.Vanilla.Features.DynaConVariationContext.Providers;
using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.Testing;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DynaConVariationContext.Providers;

public class UserDynaConProviderTests : DynaConProviderTestsBase
{
    private readonly Mock<ILastVisitorCookie> lastVisitorCookie;
    private readonly Mock<IHttpContextAccessor> httpContextAccessorMock;

    public UserDynaConProviderTests()
    {
        lastVisitorCookie = new Mock<ILastVisitorCookie>();
        httpContextAccessorMock = new Mock<IHttpContextAccessor>();
        Target = new UserDynaConProvider(httpContextAccessorMock.Object, lastVisitorCookie.Object);

        httpContextAccessorMock.SetupGet(p => p.HttpContext.User.Identity.IsAuthenticated).Returns(false);
    }

    [Fact]
    public void GetCurrentRawValue_ShouldGetDefaultValue()
    {
        Target.GetCurrentRawValue().Should().Be(UserTypes.Unknown);
    }

    [Fact]
    public void GetCurrentRawValue_ShouldBeLoggedIn()
    {
        httpContextAccessorMock.SetupGet(p => p.HttpContext.User.Identity.IsAuthenticated).Returns(true);
        Target.GetCurrentRawValue().Should().Be(UserTypes.LoggedIn);
    }

    [Fact]
    public void GetCurrentRawValue_ShouldBeWorkflow()
    {
        httpContextAccessorMock.SetupGet(x => x.HttpContext.User).Returns(new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
            { new Claim(PosApiClaimTypes.UserToken, "user-token"), new Claim(PosApiClaimTypes.SessionToken, "session-token") })));
        Target.GetCurrentRawValue().Should().Be(UserTypes.Workflow);
    }

    [Fact]
    public void GetCurrentRawValue_ShouldBeAnonymous()
    {
        httpContextAccessorMock.SetupGet(x => x.HttpContext.User).Returns(new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
            { new Claim(PosApiClaimTypes.JurisdictionId, "ANO"), new Claim(PosApiClaimTypes.AccBusinessPhase, "anonymous") })));
        Target.GetCurrentRawValue().Should().Be(UserTypes.Anonymous);
    }

    [Fact]
    public void GetCurrentRawValue_ShouldBeKnown()
    {
        lastVisitorCookie.Setup(x => x.GetValue()).Returns("orange");
        Target.GetCurrentRawValue().Should().Be(UserTypes.Known);
    }
}
