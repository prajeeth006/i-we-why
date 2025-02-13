using FluentAssertions;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.LanguageResolvers;

public sealed class UserPreferredLanguageResolverTests
{
    private IUserPreferredLanguageResolver target;
    private Mock<IGlobalizationConfiguration> config;
    private Mock<IVisitorSettingsLanguageResolver> visitorSettingsLanguageResolver;
    private Mock<IBrowserLanguageResolver> browserLanguageResolver;
    private Mock<IRobotLanguageResolver> robotLanguageResolver;

    private LanguageInfo testLang;

    public UserPreferredLanguageResolverTests()
    {
        config = new Mock<IGlobalizationConfiguration>();
        visitorSettingsLanguageResolver = new Mock<IVisitorSettingsLanguageResolver>();
        browserLanguageResolver = new Mock<IBrowserLanguageResolver>();
        robotLanguageResolver = new Mock<IRobotLanguageResolver>();

        target = new UserPreferredLanguageResolver(
            config.Object,
            visitorSettingsLanguageResolver.Object,
            browserLanguageResolver.Object,
            robotLanguageResolver.Object);

        testLang = TestLanguageInfo.Get();
    }

    private void ActAndExpectTestLang()
        => target.Resolve().Should().BeSameAs(testLang);

    [Fact]
    public void ShouldGetFromRobotResolver()
    {
        robotLanguageResolver.Setup(x => x.Resolve()).Returns(testLang);

        ActAndExpectTestLang();

        visitorSettingsLanguageResolver.VerifyNoOtherCalls();
        browserLanguageResolver.VerifyNoOtherCalls();
        config.VerifyNoOtherCalls();
    }

    [Fact]
    public void ShouldGetFromVisitorSettings()
    {
        visitorSettingsLanguageResolver.Setup(r => r.Resolve()).Returns(testLang);

        ActAndExpectTestLang();

        browserLanguageResolver.VerifyNoOtherCalls();
        config.VerifyNoOtherCalls();
    }

    [Fact]
    public void ShouldGetFromBrowser()
    {
        browserLanguageResolver.Setup(r => r.Resolve()).Returns(testLang);

        ActAndExpectTestLang();

        config.VerifyNoOtherCalls();
    }

    [Fact]
    public void ShouldGetDefault()
    {
        config.SetupGet(r => r.DefaultLanguage).Returns(testLang);

        ActAndExpectTestLang();
    }
}
