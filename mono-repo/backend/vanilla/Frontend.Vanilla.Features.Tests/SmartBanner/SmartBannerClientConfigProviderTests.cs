using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.SmartBanner;
using Frontend.Vanilla.Testing.AbstractTests;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.SmartBanner;

public class SmartBannerClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<ISmartBannerConfiguration> smartBannerConfiguration;
    private readonly Mock<IVanillaClientContentService> clientContentService;
    private readonly Mock<IMenuFactory> menuFactory;

    public SmartBannerClientConfigProviderTests()
    {
        smartBannerConfiguration = new Mock<ISmartBannerConfiguration>();
        clientContentService = new Mock<IVanillaClientContentService>();
        menuFactory = new Mock<IMenuFactory>();
        Target = new SmartBannerClientConfigProvider(
            smartBannerConfiguration.Object,
            menuFactory.Object,
            clientContentService.Object,
            new TestLogger<SmartBannerClientConfigProvider>());
    }

    [Fact]
    public void ShouldHaveCorrectName()
    {
        Target.Name.Should().Be("vnSmartBanner");
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnSmartBannerConfig()
    {
        var item = Mock.Of<ClientDocument>();
        var menuItem = new MenuItem();
        var clientEvaluationResult = ClientEvaluationResult<bool>.FromClientExpression("exp");
        smartBannerConfiguration.Setup(c => c.IsEnabled.EvaluateForClientAsync(Ct)).ReturnsAsync(clientEvaluationResult);
        smartBannerConfiguration.SetupGet(n => n.AppId).Returns("5568");
        smartBannerConfiguration.SetupGet(n => n.MinimumRating).Returns(3);
        smartBannerConfiguration.SetupGet(n => n.DisplayCounter).Returns(2);
        smartBannerConfiguration.SetupGet(n => n.ApiForDataSource).Returns(ApiForDataSource.PosApi);
        clientContentService.Setup(c => c.GetAsync("App-v1.0/SmartBanner/Content", It.IsAny<CancellationToken>(), It.IsAny<ContentLoadOptions>())).ReturnsAsync(item);
        menuFactory.Setup(c => c.GetItemAsync("App-v1.0/SmartBanner/Apps/5568", It.IsAny<DslEvaluation>(), It.IsAny<CancellationToken>())).ReturnsAsync(menuItem);

        var config = await Target_GetConfigAsync();

        config.Should().BeEquivalentTo(new Dictionary<string, object>
        {
            { "isEnabledCondition", clientEvaluationResult },
            { "appId", "5568" },
            { "minimumRating", 3 },
            { "displayCounter", 2 },
            { "apiForDataSource", ApiForDataSource.PosApi },
            { "content", item },
            { "appInfo", menuItem },
        });

        clientContentService.Verify(s => s.GetAsync("App-v1.0/SmartBanner/Content", It.IsAny<CancellationToken>(), It.IsAny<ContentLoadOptions>()));
        menuFactory.Verify(s => s.GetItemAsync("App-v1.0/SmartBanner/Apps/5568", DslEvaluation.PartialForClient, It.IsAny<CancellationToken>()));
    }
}
