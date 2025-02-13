using FluentAssertions;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Theming;
using Frontend.Vanilla.Features.UI;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Theming;

public class ThemeResolverTests
{
    private Mock<ICookieHandler> cookieHandler;
    private Mock<IUserInterfaceConfiguration> userInterfaceConfiguration;
    private IThemeResolver target;

    public ThemeResolverTests()
    {
        cookieHandler = new Mock<ICookieHandler>();
        userInterfaceConfiguration = new Mock<IUserInterfaceConfiguration>();

        target = new ThemeResolver(cookieHandler.Object, userInterfaceConfiguration.Object);

        userInterfaceConfiguration.SetupGet(o => o.Theme).Returns("black");
    }

    [Fact]
    public void ThemeShouldBeDark()
    {
        cookieHandler.Setup(o => o.GetValue(ThemeResolver.CookieName)).Returns("1");

        target.GetTheme().Should().Be("black-dark");
    }

    [Fact]
    public void ThemeShouldNotBeDark()
    {
        target.GetTheme().Should().Be("black");
    }
}
