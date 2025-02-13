using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.ContentMessages;
using Frontend.Vanilla.Features.Footer;
using Frontend.Vanilla.Features.LanguageSwitcher;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Footer;

public class FooterClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IFooterConfiguration> footerConfig;
    private readonly Mock<IContentService> contentService;
    private readonly Mock<IContentMessagesLoader> contentMessageLoader;
    private readonly Mock<IMenuFactory> menuFactory;
    private readonly Mock<ILanguageSwitcherConfiguration> languageSwitcherConfiguration;
    private readonly ClientDocument[] contentMessages = { new (), new () };
    private readonly IViewTemplate copyright = Mock.Of<IViewTemplate>(t => t.Title == "c {year}");
    private readonly MenuSection links = new ();
    private readonly MenuSection leftLogos = new ();
    private readonly MenuSection rightLogos = new ();
    private readonly MenuSection[] seoLinks = { new () };
    private readonly ClientEvaluationResult<bool> showLangSwitcher = ClientEvaluationResult<bool>.FromClientExpression("showLang");
    private readonly ClientEvaluationResult<bool> isEnabled = ClientEvaluationResult<bool>.FromClientExpression("isEnabled");

    public FooterClientConfigProviderTests()
    {
        footerConfig = new Mock<IFooterConfiguration>();
        contentService = new Mock<IContentService>();
        contentMessageLoader = new Mock<IContentMessagesLoader>();
        menuFactory = new Mock<IMenuFactory>();
        languageSwitcherConfiguration = new Mock<ILanguageSwitcherConfiguration>();

        Target = new FooterClientConfigProvider(
            footerConfig.Object,
            contentService.Object,
            contentMessageLoader.Object,
            menuFactory.Object,
            languageSwitcherConfiguration.Object);

        menuFactory.Setup(c => c.GetSectionAsync("App-v1.0/Footer2/Links", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(links);
        menuFactory.Setup(c => c.GetOptionalSectionAsync("App-v1.0/Footer2/Logos/Left", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(leftLogos);
        menuFactory.Setup(c => c.GetOptionalSectionAsync("App-v1.0/Footer2/Logos/Right", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(rightLogos);
        menuFactory.Setup(c => c.GetSectionsAsync("App-v1.0/Footer2/SEOLinks", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(seoLinks);
        languageSwitcherConfiguration.Setup(c => c.IsEnabledDslExpression.EvaluateForClientAsync(Ct)).ReturnsAsync(showLangSwitcher);
        footerConfig.Setup(c => c.Enabled.EvaluateForClientAsync(Ct)).ReturnsAsync(isEnabled);
    }

    [Fact]
    public void ShouldHaveCorrectName()
    {
        Target.Name.Should().Be("vnFooter");
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnFooterContentForResponsiveMode()
    {
        var helpButton = new MenuItem();
        var expandableModeIcons = new ExpandableModeIcons("up", "down");
        menuFactory.Setup(c => c.GetItemAsync("App-v1.0/Footer2/HelpButton", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(helpButton);
        contentService.Setup(c => c.GetAsync<IViewTemplate>($"{AppPlugin.ContentRoot}/Footer2/Copyright", Ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(copyright);
        contentMessageLoader.Setup(l => l.LoadAsync($"{AppPlugin.ContentRoot}/Footer2/ContentMessages", "vn-f", DslEvaluation.PartialForClient, Ct))
            .ReturnsAsync(contentMessages);
        footerConfig.SetupGet(c => c.ShowHelpButton).Returns(true);
        footerConfig.SetupGet(c => c.ExpandableModeEnabled).Returns(true);
        footerConfig.SetupGet(c => c.ExpandableModeIcons).Returns(expandableModeIcons);

        var config = await Target_GetConfigAsync();

        config["showHelpButton"].Should().Be(true);
        config["expandableModeEnabled"].Should().Be(true);
        config["links"].Should().BeSameAs(links);
        config["seoLinks"].Should().BeSameAs(seoLinks);
        config["contentMessages"].Should().BeSameAs(contentMessages);
        Assert.Equal(((dynamic)config["logos"]).left, leftLogos);
        Assert.Equal(((dynamic)config["logos"]).right, rightLogos);
        config["copyright"].Should().Be(copyright);
        config["showLanguageSwitcherDslCondition"].Should().BeSameAs(showLangSwitcher);
        config["isEnabledCondition"].Should().BeSameAs(isEnabled);
        config["helpButton"].Should().Be(helpButton);
        config["expandableModeIcons"].Should().Be(expandableModeIcons);
    }
}
