using FluentAssertions;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.LanguageResolvers;

public sealed class VisitorSettingsLanguageResolverTests
{
    private IVisitorSettingsLanguageResolver target;
    private Mock<ILanguageService> languageService;
    private Mock<IVisitorSettingsManager> settingsManager;

    public VisitorSettingsLanguageResolverTests()
    {
        languageService = new Mock<ILanguageService>();
        settingsManager = new Mock<IVisitorSettingsManager>();
        target = new VisitorSettingsLanguageResolver(languageService.Object, settingsManager.Object);
    }

    [Fact]
    public void ShouldResolveFromVisitorSettings_IfAvailable()
    {
        var testLang = TestLanguageInfo.Get();
        languageService.Setup(r => r.FindByName("de-AT")).Returns(testLang);
        settingsManager.SetupGet(m => m.Received).Returns(new VisitorSettings().With(cultureName: "de-AT"));

        // Act
        var result = target.Resolve();

        result.Should().BeSameAs(testLang);
    }

    [Fact]
    public void ShouldReturnNull_IfNoCulture()
    {
        settingsManager.SetupGet(m => m.Received).Returns(new VisitorSettings());

        // Act
        var lang = target.Resolve();

        lang.Should().BeNull();
        languageService.Verify(r => r.FindByName(null));
    }
}
