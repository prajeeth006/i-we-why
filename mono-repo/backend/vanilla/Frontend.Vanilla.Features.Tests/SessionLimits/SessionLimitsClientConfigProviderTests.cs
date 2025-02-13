using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features.SessionLimits;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.SessionLimits;

public class SessionLimitsClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<ISessionLimitsConfiguration> sessionLimitsConfiguration;
    private readonly Mock<IVanillaClientContentService> clientContentService;
    private readonly Mock<IMenuFactory> menuFactory;

    public SessionLimitsClientConfigProviderTests()
    {
        sessionLimitsConfiguration = new Mock<ISessionLimitsConfiguration>();
        clientContentService = new Mock<IVanillaClientContentService>();
        menuFactory = new Mock<IMenuFactory>();

        Target = new SessionLimitsClientConfigProvider(sessionLimitsConfiguration.Object, clientContentService.Object, menuFactory.Object);
    }

    [Fact]
    public async Task ShouldReturnRedirectMessageClientConfig()
    {
        var message = new ClientViewTemplate();
        clientContentService.Setup(c => c.GetAsync("App-v1.0/SessionLimits/SessionLimits", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(message);

        var ctaContent = new MenuItem();
        menuFactory.Setup(c => c.GetItemAsync("App-v1.0/SessionLimits/UpdateCTA", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(ctaContent);

        sessionLimitsConfiguration.SetupGet(c => c.IsAutoLogoutEnabled).Returns(true);
        sessionLimitsConfiguration.SetupGet(c => c.CloseWaitingTime).Returns(15);
        sessionLimitsConfiguration.SetupGet(c => c.SkipOverlay).Returns(false);
        sessionLimitsConfiguration.SetupGet(c => c.Version).Returns(1);
        var config = await Target_GetConfigAsync();

        config["isAutoLogoutEnabled"].Should().Be(true);
        config["skipOverlay"].Should().Be(false);
        config["closeWaitingTime"].Should().Be(15);
        config["content"].Should().Be(message);
        config["updateCTA"].Should().Be(ctaContent);
        config["version"].Should().Be(1);
    }
}
