using System;
using FluentAssertions;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Login;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Cookies;

public class SuperCookieTests
{
    private ISuperCookie target;
    private Mock<ICookieHandler> cookieHandler;
    private Mock<ILoginSettingsConfiguration> loginConfigurationSettings;

    public SuperCookieTests()
    {
        cookieHandler = new Mock<ICookieHandler>();
        loginConfigurationSettings = new Mock<ILoginSettingsConfiguration>();
        target = new SuperCookie(cookieHandler.Object, loginConfigurationSettings.Object);
    }

    [Fact]
    public void GetValueTest()
    {
        cookieHandler.Setup(h => h.GetValue(CookieConstants.SuperCookie)).Returns("Crispy");
        target.GetValue().Should().Be("Crispy");
    }

    [Fact]
    public void SetValueTest()
    {
        target.SetValue("Crispy");
        cookieHandler.Verify(h => h.Set(CookieConstants.SuperCookie, "Crispy", new CookieSetOptions { MaxAge = new TimeSpan(365 * 10, 0, 0, 0) }));
    }
}
