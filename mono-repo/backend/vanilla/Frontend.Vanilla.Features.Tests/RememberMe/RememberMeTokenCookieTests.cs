using System;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.RememberMe;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.RememberMe;

public class RememberMeTokenCookieTests
{
    private IRememberMeTokenCookie target;
    private Mock<ICookieHandler> cookieHandler;
    private RememberMeConfiguration rememberMeConfig;
    private Mock<IHttpContextAccessor> httpContextAccessor;
    private Mock<IClock> clock;

    public RememberMeTokenCookieTests()
    {
        cookieHandler = new Mock<ICookieHandler>();
        rememberMeConfig = new RememberMeConfiguration();
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        clock = new Mock<IClock>();
        target = new RememberMeTokenCookie(cookieHandler.Object, rememberMeConfig, httpContextAccessor.Object, clock.Object);

        clock.SetupGet(x => x.UtcNow).Returns(new UtcDateTime(2020, 1, 1, 10, 0, 0, 0));
        rememberMeConfig.Expiration = TimeSpan.FromHours(1);
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.PathBase).Returns(RememberMeTokenCookie.TokenCookiePath);
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Path).Returns("/page");
    }

    [Theory]
    [InlineData(null, null)]
    [InlineData("", null)]
    [InlineData("  ", null)]
    [InlineData(" abc  ", "abc")]
    [InlineData("abc", "abc")]
    public void Get_ShouldGetTokenCookieValue(string input, string expected)
    {
        cookieHandler.Setup(h => h.GetValue(RememberMeTokenCookie.TokenCookieName)).Returns(input);

        // Act
        var result = target.Get();

        (result?.Value).Should().Be(expected);
    }

    [Fact]
    public void Get_ShouldThrow_IfNotUnderLoginPath()
        => RunNotUnderLoginPathTest(() => target.Get());

    [Fact]
    public void Set_ShouldSetAllCookies()
    {
        // Act
        target.Set("abc");

        cookieHandler.Verify(h => h.Set(RememberMeTokenCookie.ExpirationDateCookieName, ItIs.NotWhiteSpace(), new CookieSetOptions
        {
            MaxAge = TimeSpan.FromHours(1),
        }));

        cookieHandler.Verify(h => h.Set(RememberMeTokenCookie.TokenCookieName, "abc", new CookieSetOptions
        {
            Expires = clock.Object.UtcNow + TimeSpan.FromHours(1),
            HttpOnly = true,
            Domain = CookieDomain.Full,
            Path = RememberMeTokenCookie.TokenCookiePath,
        }));
        cookieHandler.Verify(h => h.Set(RememberMeTokenCookie.IndicatorCookieName, ItIs.NotWhiteSpace(), new CookieSetOptions
        {
            Expires = clock.Object.UtcNow + TimeSpan.FromHours(1),
        }));
        cookieHandler.Verify(h => h.Set(RememberMeTokenCookie.HistoryCookieName, ItIs.NotWhiteSpace(), new CookieSetOptions
        {
            MaxAge = TimeSpan.FromHours(5),
        }));
    }

    [Fact]
    public void Set_ShouldSetCookiesKeepingCurrentExpirationDate()
    {
        var currentExpiration = clock.Object.UtcNow + TimeSpan.FromHours(2);
        cookieHandler.Setup(h => h.GetValue(RememberMeTokenCookie.ExpirationDateCookieName)).Returns(currentExpiration.ToString());

        // Act
        target.Set("abc");

        cookieHandler.Verify(h => h.Set(RememberMeTokenCookie.ExpirationDateCookieName, ItIs.NotWhiteSpace(), new CookieSetOptions
        {
            MaxAge = TimeSpan.FromHours(1),
        }), Times.Never);

        cookieHandler.Verify(h => h.Set(RememberMeTokenCookie.TokenCookieName, "abc", new CookieSetOptions
        {
            Expires = currentExpiration,
            HttpOnly = true,
            Domain = CookieDomain.Full,
            Path = RememberMeTokenCookie.TokenCookiePath,
        }));
        cookieHandler.Verify(h => h.Set(RememberMeTokenCookie.IndicatorCookieName, ItIs.NotWhiteSpace(), new CookieSetOptions
        {
            Expires = currentExpiration,
        }));
        cookieHandler.Verify(h => h.Set(RememberMeTokenCookie.HistoryCookieName, ItIs.NotWhiteSpace(), new CookieSetOptions
        {
            MaxAge = TimeSpan.FromHours(5),
        }));
    }

    [Fact]
    public void Set_ShouldThrow_IfNotUnderLoginPath()
        => RunNotUnderLoginPathTest(() => target.Set("abc"));

    [Fact]
    public void Delete_ShouldRemoveAllCookies()
    {
        // Act
        target.Delete();

        cookieHandler.Verify(h => h.Delete(RememberMeTokenCookie.TokenCookieName, new CookieLocationOptions
        {
            Domain = CookieDomain.Full,
            Path = RememberMeTokenCookie.TokenCookiePath,
        }));
        cookieHandler.Verify(h => h.Delete(RememberMeTokenCookie.IndicatorCookieName, null));
        cookieHandler.Verify(h => h.Delete(RememberMeTokenCookie.HistoryCookieName, null));
    }

    [Fact]
    public void Delete__ShouldThrow_IfNotUnderLoginPath()
        => RunNotUnderLoginPathTest(() => target.Delete());

    private void RunNotUnderLoginPathTest(Action act)
    {
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.PathBase).Returns("/en/api");
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Path).Returns("/not-cookie-path");

        act.Should().Throw<InvalidOperationException>()
            .Which.Message.Should().ContainAll("'/en/api/not-cookie-path'", RememberMeTokenCookie.TokenCookiePath);
    }

    [Fact]
    public void TokenCookiePath_ShouldBeConstantValue()
        => RememberMeTokenCookie.TokenCookiePath.Should().Be("/api/auth");
}
