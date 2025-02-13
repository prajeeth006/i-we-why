using System;
using System.Collections.Concurrent;
using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Content.DataSources;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.WebIntegration.Content;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Content;

public sealed class WebSitecoreLanguageResolverTests
{
    private ISitecoreLanguageResolver target;
    private Mock<ILanguageService> languageService;
    private Mock<ICurrentContextAccessor> currentContextAccessor;

    public WebSitecoreLanguageResolverTests()
    {
        languageService = new Mock<ILanguageService>();
        currentContextAccessor = new Mock<ICurrentContextAccessor>();
        target = new WebSitecoreLanguageResolver(languageService.Object, currentContextAccessor.Object);

        languageService.SetupGet(r => r.Allowed).Returns(new[]
        {
            TestLanguageInfo.Get("de-AT", routeValue: "rv-de", sitecoreContentLanguage: "sc-de", sitecoreContentDefaultLanguage: Tuple.Create("scd-de")),
            TestLanguageInfo.Get("es-ES", routeValue: "rv-es", sitecoreContentLanguage: "sc-es", sitecoreContentDefaultLanguage: new Tuple<string>(null)),
        });
        currentContextAccessor.SetupGet(a => a.Items).Returns(new ConcurrentDictionary<object, Lazy<object>>());
    }

    [Theory]
    [InlineData("de-AT", "sc-de", "scd-de", "rv-de")]
    [InlineData("es-ES", "sc-es", null, "rv-es")]
    public void GetContentLanguage_Test(string inputCulture, string expectedContentLang, string expectedContentDefaultLang, string expectedUrlLang)
    {
        // Act
        var langs = target.ResolveLanguages(new CultureInfo(inputCulture));

        langs.ContentLanguage.Should().Be(expectedContentLang);
        (langs.ContentDefaultLanguage?.Value).Should().Be(expectedContentDefaultLang);
        langs.UrlLanguage.Should().Be(expectedUrlLang);
    }

    [Fact]
    public void ShouldCacheResultPerInputCulture()
    {
        // Act
        var deLangs = target.ResolveLanguages(new CultureInfo("de-AT"));
        var esLangs = target.ResolveLanguages(new CultureInfo("es-ES"));
        var deLangs2 = target.ResolveLanguages(new CultureInfo("de-AT"));

        deLangs2.Should().BeSameAs(deLangs);
        esLangs.Should().NotBeSameAs(deLangs);
    }

    [Fact]
    public void ShouldThrowIfLanguageNotFound()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("sw-KE"));
        var culture = new CultureInfo("it-IT");

        Action act = () => target.ResolveLanguages(culture);

        act.Should().Throw<InvalidOperationException>().Which.Message
            .Should().Contain("culture 'it-IT'")
            .And.Contain("de-AT, es-ES") // allowed cultures
            .And.Contain("sw-KE") // current culture
            .And.Contain(GlobalizationConfiguration.FeatureName)
            .And.Contain("Called from: ").And.Contain(nameof(ShouldThrowIfLanguageNotFound));
    }
}
