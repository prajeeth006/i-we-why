using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.HtmlInjection;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.HtmlInjection;

public class HtmlInjectionControlOverrideTests
{
    private IHtmlInjectionControlOverride target;
    private Mock<ICookieHandler> cookieHandlerAdapter;

    public HtmlInjectionControlOverrideTests()
    {
        cookieHandlerAdapter = new Mock<ICookieHandler>();

        target = new HtmlInjectionControlOverride(cookieHandlerAdapter.Object);
    }

    [Fact]
    public void IsDisabled_ShouldReturnTrueWhenOverrideCookieDisablesSpecifiedOptionAndFalseOtherwise()
    {
        cookieHandlerAdapter.Setup(c => c.GetValue(HtmlInjectionControlOverride.CookieName)).Returns("GTM,AbTesting");

        target.IsDisabled(HtmlInjectionKind.Gtm).Should().BeTrue();
        target.IsDisabled(HtmlInjectionKind.AbTesting).Should().BeTrue();
        target.IsDisabled(HtmlInjectionKind.SitecoreHtmlHeadTags).Should().BeFalse();
        target.IsDisabled(HtmlInjectionKind.HeadTags).Should().BeFalse();
    }

    [Theory, ValuesData(null, "", "  ", "ble")]
    public void ShouldNotDisableWhenOverrideSourceCookieIsInvalidOrEmpty(string value)
    {
        cookieHandlerAdapter.Setup(c => c.GetValue(HtmlInjectionControlOverride.CookieName)).Returns(value);

        foreach (var kind in Enum<HtmlInjectionKind>.Values.Where(v => v != 0))
            target.IsDisabled(kind).Should().BeFalse();
    }
}
