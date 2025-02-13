using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.Session;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Configuration.DynaCon;

public class WebDynaConOverridesSessionIdentifierTests
{
    private IDynaConOverridesSessionIdentifier target;
    private Mock<IHttpContextAccessor> httpContextAccessor;
    private Mock<ICookieHandler> cookieHandler;

    public WebDynaConOverridesSessionIdentifierTests()
    {
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        cookieHandler = new Mock<ICookieHandler>();

        httpContextAccessor.SetupGet(o => o.HttpContext).Returns(Mock.Of<HttpContext>());

        target = new WebDynaConOverridesSessionIdentifier(cookieHandler.Object, httpContextAccessor.Object);
    }

    [Theory, ValuesData(null, "xxx")]
    public void Value_ShouldReturnCookieValue(string testValue)
    {
        cookieHandler.Setup(c => c.GetValue(WebDynaConOverridesSessionIdentifier.CookieName)).Returns(testValue);

        // Act
        var value = target.Value;

        (value?.Value).Should().Be(testValue);
        cookieHandler.VerifyWithAnyArgs(h => h.Set(null, null, null), Times.Never);
    }

    [Fact]
    public void Value_ShouldReturnNull_IfNoHttpContext()
    {
        httpContextAccessor.SetupGet(o => o.HttpContext).Returns((HttpContext)null);

        // Act
        var value = target.Value;

        value.Should().BeNull();
        cookieHandler.VerifyWithAnyArgs(h => h.Set(null, null, null), Times.Never);
    }

    [Theory, ValuesData("", "  ", "  not-trimmed")]
    public void Value_ShouldThrow_IfInvalidValue(string value)
    {
        cookieHandler.Setup(c => c.GetValue(WebDynaConOverridesSessionIdentifier.CookieName)).Returns(value);

        Func<object> act = () => target.Value;

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Create_ShouldSetCookie()
    {
        // Act
        var value = target.Create();

        value.Value.Should().MatchRegex("[a-z0-9]{16}");
        cookieHandler.Verify(h => h.Set(WebDynaConOverridesSessionIdentifier.CookieName, value, new CookieSetOptions { Domain = CookieDomain.Label, HttpOnly = true }));
    }

    [Fact]
    public void Delete_ShouldRemoveCookie()
    {
        // Act
        target.Delete();

        cookieHandler.Verify(h =>
            h.Delete(WebDynaConOverridesSessionIdentifier.CookieName, It.Is<CookieLocationOptions>(o => o.Domain == CookieDomain.Label && o.Path == "/")));
    }
}
