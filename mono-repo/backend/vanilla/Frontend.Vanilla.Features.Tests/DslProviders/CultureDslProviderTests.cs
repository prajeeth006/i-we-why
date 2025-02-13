using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class CultureDslProviderTests
{
    private ICultureDslProvider target;
    private Mock<ILanguageService> languageService;
    private Mock<IBrowserLanguageResolver> browserLanguageResolver;
    private Mock<IVisitorSettingsLanguageResolver> visitorSettingsLanguageResolver;

    public CultureDslProviderTests()
    {
        languageService = new Mock<ILanguageService>();
        browserLanguageResolver = new Mock<IBrowserLanguageResolver>();
        visitorSettingsLanguageResolver = new Mock<IVisitorSettingsLanguageResolver>();
        target = new CultureDslProvider(languageService.Object, browserLanguageResolver.Object, visitorSettingsLanguageResolver.Object);

        languageService.SetupGet(r => r.Allowed).Returns(new[]
        {
            TestLanguageInfo.Get("de-AT", routeValue: "wtf"),
            TestLanguageInfo.Get("es-ES", routeValue: "omg"),
        });
    }

    [Fact]
    public void Default_ShouldGetCultureFromDefaultLanguage()
    {
        languageService.SetupGet(r => r.Default).Returns(TestLanguageInfo.Get("sw-KE"));

        // Act
        target.Default.Should().Be("sw-KE");
    }

    [Fact]
    public void GetAllowed_ShouldJointAllowedCultures()
        => target.GetAllowed().Should().Be("de-AT, es-ES");

    [Fact]
    public void Current_ShouldGetCurrentCulture()
    {
        CultureInfoHelper.SetCurrent(CultureInfo.GetCultureInfo("zh-CN"));
        target.Current.Should().Be("zh-CN");
    }

    [Theory, ValuesData(null, "sw-KE")]
    public void GetFromClaims_ShouldGetCultureFromUsersCulture(string culture)
    {
        languageService.Setup(r => r.FindByUserClaims()).Returns(culture != null ? TestLanguageInfo.Get(culture) : null);

        // Act
        target.GetFromClaims().Should().Be(culture);
    }

    [Theory, ValuesData(null, "sw-KE")]
    public void GetFromBrowser_ShouldGetCultureFromUsersCulture(string culture)
    {
        browserLanguageResolver.Setup(r => r.Resolve()).Returns(culture != null ? TestLanguageInfo.Get(culture) : null);

        // Act
        target.GetFromBrowser().Should().Be(culture);
    }

    [Theory, ValuesData(null, "sw-KE")]
    public void GetFromPreviousVisit_ShouldGetCultureFromUsersCulture(string culture)
    {
        visitorSettingsLanguageResolver.Setup(r => r.Resolve()).Returns(culture != null ? TestLanguageInfo.Get(culture) : null);

        // Act
        target.GetFromPreviousVisit().Should().Be(culture);
    }

    [Theory]
    [InlineData("de-AT", "wtf")]
    [InlineData("es-ES", "omg")]
    public void GetUrlToken_ShouldGetRouteValueOfCorrespondingAllowedLanguage(string inputCulture, string expectedToken)
        => target.GetUrlToken(inputCulture).Should().Be(expectedToken);

    [Theory, ValuesData(null, "", "gibberish", "fr-FR")]
    public void GetUrlToken_ShouldThrow_IfInvalidOrNothingFound(string inputCulture)
        => target.Invoking(t => t.GetUrlToken(inputCulture))
            .Should().Throw()
            .Which.Message.Should().ContainAll(inputCulture.Dump(), "de-AT, es-ES");
}
