using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.Offline;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Pwa;

public class OfflineClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private Mock<IVanillaClientContentService> clientContentService;
    private Mock<IOfflineConfiguration> offlineConfiguration;
    private ClientEvaluationResult<bool> clientEvaluationResult;

    private ClientDocument content;

    public OfflineClientConfigProviderTests()
    {
        content = new ClientDocument();
        clientContentService = new Mock<IVanillaClientContentService>();
        offlineConfiguration = new Mock<IOfflineConfiguration>();
        clientEvaluationResult = ClientEvaluationResult<bool>.FromClientExpression("exp");

        var overlayEnabledExpression = new Mock<IDslExpression<bool>>();
        overlayEnabledExpression.Setup(e => e.EvaluateForClientAsync(Ct)).ReturnsAsync(clientEvaluationResult);
        offlineConfiguration.SetupGet(o => o.OfflineRequestsThreshold).Returns(10);
        offlineConfiguration.SetupGet(o => o.IsOfflineOverlayEnabled).Returns(overlayEnabledExpression.Object);
        clientContentService.Setup(c => c.GetAsync("App-v1.0/Offline/Offline", Ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(content);
        Target = new OfflineClientConfigProvider(offlineConfiguration.Object, clientContentService.Object);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnOfflineConfig()
    {
        var config = await Target_GetConfigAsync();

        config["isOverlayEnabled"].Should().Be(clientEvaluationResult);
        config["offlineRequestsThreshold"].Should().Be(10);
        config["content"].Should().BeSameAs(content);
    }
}
