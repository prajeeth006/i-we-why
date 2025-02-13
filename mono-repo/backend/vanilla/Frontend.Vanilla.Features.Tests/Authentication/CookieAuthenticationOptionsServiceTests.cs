using System;
using System.Security.Claims;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Authentication;

public sealed class CookieAuthenticationOptionsServiceTests
{
    private ICookieAuthenticationOptionsService target;
    private Mock<IAuthenticationConfiguration> authenticationConfiguration;
    private readonly TestClock clock;
    private Mock<ICookiePartitionedStateProvider> cookiePartitionedStateProvider;

    public CookieAuthenticationOptionsServiceTests()
    {
        authenticationConfiguration = new Mock<IAuthenticationConfiguration>();
        clock = new TestClock();
        cookiePartitionedStateProvider = new Mock<ICookiePartitionedStateProvider>();

        target = new CookieAuthenticationOptionsService(authenticationConfiguration.Object, clock, cookiePartitionedStateProvider.Object);
        authenticationConfiguration.SetupGet(c => c.Timeout).Returns(TimeSpan.FromHours(1));
    }

    [Fact]
    public void OverrideOnSigningIn()
    {
        var context = new CookieSigningInContext(new DefaultHttpContext(),
            new AuthenticationScheme("Cookies", "Cookies", typeof(IAuthenticationHandler)),
            Mock.Of<CookieAuthenticationOptions>(),
            new ClaimsPrincipal(),
            new AuthenticationProperties(),
            It.IsAny<CookieOptions>());
        target.OverrideOnSigningIn(context);

        Assert.Equal(context.Properties.ExpiresUtc, clock.UtcNow.AddHours(1).ValueWithOffset);
        cookiePartitionedStateProvider.Verify(c => c.SetPartitionedState(It.IsAny<CookieOptions>()));
    }

    [Fact]
    public void OverrideOnSigningOut()
    {
        var context = new CookieSigningOutContext(new DefaultHttpContext(),
            new AuthenticationScheme("Cookies", "Cookies", typeof(IAuthenticationHandler)),
            Mock.Of<CookieAuthenticationOptions>(),
            It.IsAny<AuthenticationProperties>(),
            It.IsAny<CookieOptions>());
        target.OverrideOnSigningOut(context);

        cookiePartitionedStateProvider.Verify(c => c.SetPartitionedState(It.IsAny<CookieOptions>()));
    }
}
