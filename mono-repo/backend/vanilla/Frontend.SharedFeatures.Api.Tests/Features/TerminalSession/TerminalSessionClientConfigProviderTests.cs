using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.TerminalSession;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.TerminalSession;

public class TerminalSessionClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<ITerminalSessionConfiguration> terminalSessionConfigurationMock;
    private readonly Mock<IVanillaClientContentService> clientContentServiceMock;
    private readonly Mock<IMenuFactory> menuFactoryMock;

    public TerminalSessionClientConfigProviderTests()
    {
        terminalSessionConfigurationMock = new Mock<ITerminalSessionConfiguration>();
        clientContentServiceMock = new Mock<IVanillaClientContentService>();
        menuFactoryMock = new Mock<IMenuFactory>();

        Target = new TerminalSessionClientConfigProvider(terminalSessionConfigurationMock.Object, clientContentServiceMock.Object, menuFactoryMock.Object);
    }

    [Fact]
    public async Task ClientConfig_ShouldReturnContentMessages()
    {
        var depositAlertTimeSpan = new TimeSpan(0, 0, 0);
        terminalSessionConfigurationMock.SetupGet(c => c.DepositAlertTimeSpan).Returns(depositAlertTimeSpan);

        var template = new ClientViewTemplate();
        clientContentServiceMock.Setup(c => c.GetAsync($"{AppPlugin.ContentRoot}/TerminalSession/Content", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(template);

        var menuItem = new MenuItem();
        menuFactoryMock.Setup(c => c.GetItemAsync($"{AppPlugin.ContentRoot}/TerminalSession/ContinueSessionButton", DslEvaluation.PartialForClient, Ct))
            .ReturnsAsync(menuItem);
        menuFactoryMock.Setup(c => c.GetItemAsync($"{AppPlugin.ContentRoot}/TerminalSession/FinishButton", DslEvaluation.PartialForClient, Ct))
            .ReturnsAsync(menuItem);

        var config = await Target_GetConfigAsync();

        config["content"].Should().Be(template);
        config["depositAlertTime"].Should().Be(depositAlertTimeSpan.TotalMilliseconds);
        config["continueSessionButton"].Should().Be(menuItem);
        config["finishButton"].Should().Be(menuItem);
    }
}
