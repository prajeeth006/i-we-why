using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.Globalization.Middlewares;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.Middlewares;

public class DefaultLanguageMiddlewareTests
{
    private BeforeNextMiddleware target;
    private Mock<IGlobalizationConfiguration> globalizationConfigurationMock;
    private LanguageInfo defaultLang;

    public DefaultLanguageMiddlewareTests()
    {
        globalizationConfigurationMock = new Mock<IGlobalizationConfiguration>();
        defaultLang = TestLanguageInfo.Get();
        globalizationConfigurationMock.SetupGet(x => x.DefaultLanguage).Returns(defaultLang);
        target = new DefaultLanguageMiddleware(null, globalizationConfigurationMock.Object);
    }

    [Fact]
    public void ShouldSetupDefaultLanguage()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("de-AT"));

        // Act
        target.BeforeNext(null);

        CultureInfo.CurrentCulture.Name.Should().Be(defaultLang.Culture.Name);
        CultureInfo.CurrentUICulture.Name.Should().Be(defaultLang.Culture.Name);
    }
}
