using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.LanguageSwitcher;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.LanguageSwitcher;

public class LanguageSwitcherClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private Mock<ILanguageSwitcherConfiguration> languageSwitcherConfig;
    private readonly ClientEvaluationResult<bool> showLangSwitcher = ClientEvaluationResult<bool>.FromClientExpression("showLang");
    private readonly ClientEvaluationResult<bool> openPopup = ClientEvaluationResult<bool>.FromClientExpression("openPopup");
    private readonly ClientEvaluationResult<bool> showHeader = ClientEvaluationResult<bool>.FromClientExpression("showHeader");
    private readonly bool useFastIcons = false;
    private const int Version = 1;

    public LanguageSwitcherClientConfigProviderTests()
    {
        languageSwitcherConfig = new Mock<ILanguageSwitcherConfiguration>();

        Target = new LanguageSwitcherClientConfigProvider(languageSwitcherConfig.Object);

        languageSwitcherConfig.Setup(c => c.IsEnabledDslExpression.EvaluateForClientAsync(Ct)).ReturnsAsync(showLangSwitcher);
        languageSwitcherConfig.Setup(c => c.OpenPopupDslExpression.EvaluateForClientAsync(Ct)).ReturnsAsync(openPopup);
        languageSwitcherConfig.Setup(c => c.ShowHeaderDslExpression.EvaluateForClientAsync(Ct)).ReturnsAsync(showHeader);
        languageSwitcherConfig.Setup(c => c.Version).Returns(Version);
        languageSwitcherConfig.Setup(c => c.UseFastIcons).Returns(useFastIcons);
    }

    [Fact]
    public void ShouldHaveCorrectName()
    {
        Target.Name.Should().Be("vnLanguageSwitcher");
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnLanguageSwitcherConfig()
    {
        var config = await Target_GetConfigAsync();

        config["isEnabledDslExpression"].Should().BeSameAs(showLangSwitcher);
        config["openPopupDslExpression"].Should().BeSameAs(openPopup);
        config["showHeaderDslExpression"].Should().BeSameAs(showHeader);
        config["version"].Should().Be(Version);
    }
}
