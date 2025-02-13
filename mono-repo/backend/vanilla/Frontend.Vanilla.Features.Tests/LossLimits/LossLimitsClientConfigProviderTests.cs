using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features.LossLimits;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.LossLimits;

public class LossLimitsClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private Mock<ILossLimitsConfiguration> lossLimitsConfiguration;
    private Mock<IVanillaClientContentService> clientContentService;
    private Mock<IMenuFactory> menuFactory;

    public LossLimitsClientConfigProviderTests()
    {
        lossLimitsConfiguration = new Mock<ILossLimitsConfiguration>();
        clientContentService = new Mock<IVanillaClientContentService>();
        menuFactory = new Mock<IMenuFactory>();

        Target = new LossLimitsClientConfigProvider(lossLimitsConfiguration.Object, clientContentService.Object, menuFactory.Object);
    }

    [Fact]
    public async Task ShouldReturnRedirectMessageClientConfig()
    {
        var message = new ClientViewTemplate();
        clientContentService.Setup(c => c.GetAsync("App-v1.0/LossLimits/LossLimits", Ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(message);

        var ctaContent = new MenuItem();
        menuFactory.Setup(c => c.GetItemAsync("App-v1.0/LossLimits/UpdateCTA", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(ctaContent);

        lossLimitsConfiguration.SetupGet(c => c.CloseWaitingTime).Returns(15);

        var config = await Target_GetConfigAsync();

        config["closeWaitingTime"].Should().Be(15);
        config["content"].Should().Be(message);
        config["updateCTA"].Should().Be(ctaContent);
    }
}
