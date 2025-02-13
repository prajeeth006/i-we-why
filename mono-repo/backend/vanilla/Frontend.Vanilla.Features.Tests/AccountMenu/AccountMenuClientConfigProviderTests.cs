using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.AccountMenu;
using Frontend.Vanilla.Features.Header;
using Frontend.Vanilla.Testing.AbstractTests;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.AccountMenu;

public class AccountMenuClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IMenuFactory> menuFactory;
    private readonly Mock<IVanillaClientContentService> clientContentServiceMock;
    private readonly Mock<IAccountMenuConfiguration> accountMenuConfigurationMock;
    private readonly Mock<IHeaderConfiguration> headerConfiguration;
    private readonly Mock<ILogger<AccountMenuClientConfigProvider>> logMock;
    private readonly MenuItem root;

    public AccountMenuClientConfigProviderTests()
    {
        menuFactory = new Mock<IMenuFactory>();
        clientContentServiceMock = new Mock<IVanillaClientContentService>();
        accountMenuConfigurationMock = new Mock<IAccountMenuConfiguration>();
        headerConfiguration = new Mock<IHeaderConfiguration>();
        logMock = new Mock<ILogger<AccountMenuClientConfigProvider>>();
        Ct = TestCancellationToken.Get();

        Target = new AccountMenuClientConfigProvider(
            menuFactory.Object,
            clientContentServiceMock.Object,
            accountMenuConfigurationMock.Object,
            headerConfiguration.Object,
            logMock.Object);
        root = new MenuItem();

        menuFactory.Setup(f => f.GetItemAsync($"{AppPlugin.ContentRoot}/AccountMenu/Main", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(root);
    }

    [Fact]
    public void ShouldHaveCorrectName()
    {
        Target.Name.Should().Be("vnAccountMenu");
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnAccountMenuContent_IfResponsiveFeatureAreEnabled()
    {
        var resources = Mock.Of<ClientDocument>();
        clientContentServiceMock.Setup(s => s.GetAsync($"{AppPlugin.ContentRoot}/AccountMenu/Resources", Ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(resources);

        var clientEvaluationResult = ClientEvaluationResult<bool>.FromClientExpression("exp");
        accountMenuConfigurationMock.Setup(c => c.PaypalBalanceMessageEnabled.EvaluateForClientAsync(Ct)).ReturnsAsync(clientEvaluationResult);
        accountMenuConfigurationMock.SetupGet(c => c.Version).Returns(1);
        accountMenuConfigurationMock.SetupGet(c => c.VipLevels).Returns(new[] { "GOLD" });
        accountMenuConfigurationMock.SetupGet(c => c.IgnoreVipLevel).Returns(true);
        accountMenuConfigurationMock.SetupGet(c => c.Onboarding).Returns(new Onboarding { ShowHeaderHotspotLoginCount = 5, ShowPulseEffectLoginCount = 2 });
        accountMenuConfigurationMock.SetupGet(c => c.ProfilePageItemsPosition).Returns(new Dictionary<string, int>
        {
            { "inbox", 3 },
        });

        dynamic config = await Target.GetClientConfigAsync(Ct);

        ((object)config.account.isPaypalBalanceMessageEnabled).Should().BeSameAs(clientEvaluationResult);
        ((object)config.account.VipLevels).Should().BeEquivalentTo(new[] { "GOLD" });
        ((object)config.account.IgnoreVipLevel).Should().Be(true);
        ((object)config.account.Version).Should().Be(1);
        ((object)config.account.Onboarding.ShowHeaderHotspotLoginCount).Should().Be(5);
        ((object)config.account.Onboarding.ShowPulseEffectLoginCount).Should().Be(2);
        ((object)config.account.root).Should().BeSameAs(root);
        ((object)config.resources).Should().BeSameAs(resources);
        ((object)config.account.ProfilePageItemsPosition).Should().BeEquivalentTo(new Dictionary<string, int>
        {
            { "inbox", 3 },
        });
    }

    [Fact]
    public async Task GetClientConfiguration_UseDifferentContentForV3()
    {
        var resources = Mock.Of<ClientDocument>();
        var vipLevels = Mock.Of<MenuSection>();
        var tourItems = Mock.Of<IReadOnlyList<ClientDocument>>();
        var startTourScreen = Mock.Of<MenuItem>();
        clientContentServiceMock.Setup(s => s.GetAsync($"{AppPlugin.ContentRoot}/AccountMenu/Resources", Ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(resources);
        clientContentServiceMock.Setup(s => s.GetChildrenAsync($"{AppPlugin.ContentRoot}/AccountMenu3/OnBoarding/TourItems", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(tourItems);
        menuFactory.Setup(s => s.GetSectionAsync($"{AppPlugin.ContentRoot}/AccountMenu2/VIP", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(vipLevels);
        menuFactory.Setup(s => s.GetItemAsync($"{AppPlugin.ContentRoot}/AccountMenu3/OnBoarding/StartTourScreen", DslEvaluation.PartialForClient, Ct))
            .ReturnsAsync(startTourScreen);
        accountMenuConfigurationMock.SetupGet(c => c.VipLevels).Returns(new[] { "GOLD" });

        var root3 = new MenuItem();

        menuFactory.Setup(f => f.GetItemAsync($"{AppPlugin.ContentRoot}/AccountMenu3/Main", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(root3);

        accountMenuConfigurationMock.SetupGet(c => c.Version).Returns(3);

        dynamic config = await Target.GetClientConfigAsync(Ct);

        ((object)config.account.Version).Should().Be(3);
        ((object)config.account.root).Should().BeSameAs(root3);
        ((object)config.account.VipLevels).Should().BeEquivalentTo(new[] { "GOLD" });
        ((object)config.vipLevels).Should().BeSameAs(vipLevels.Items);
        ((object)config.onBoarding.tourItems).Should().Be(tourItems);
        ((object)config.onBoarding.startTourScreen).Should().Be(startTourScreen);
    }
}
