using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.DepositSession;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.DepositSession;

public class DepositSessionClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IVanillaClientContentService> clientContentServiceMock;
    private readonly Mock<IMenuFactory> menuFactoryMock;

    public DepositSessionClientConfigProviderTests()
    {
        clientContentServiceMock = new Mock<IVanillaClientContentService>();
        menuFactoryMock = new Mock<IMenuFactory>();

        Target = new DepositSessionClientConfigProvider(clientContentServiceMock.Object, menuFactoryMock.Object);
    }

    [Fact]
    public async Task ClientConfig_ShouldReturnContentMessages()
    {
        var template = new ClientViewTemplate();
        clientContentServiceMock.Setup(c => c.GetAsync($"{AppPlugin.ContentRoot}/DepositSession/Content", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(template);

        var menuItem = new MenuItem();
        menuFactoryMock.Setup(c => c.GetItemAsync($"{AppPlugin.ContentRoot}/DepositSession/ContinueSessionButton", DslEvaluation.PartialForClient, Ct))
            .ReturnsAsync(menuItem);
        menuFactoryMock.Setup(c => c.GetItemAsync($"{AppPlugin.ContentRoot}/DepositSession/FinishButton", DslEvaluation.PartialForClient, Ct))
            .ReturnsAsync(menuItem);

        var config = await Target_GetConfigAsync();

        config["content"].Should().Be(template);
        config["continueSessionButton"].Should().Be(menuItem);
        config["finishButton"].Should().Be(menuItem);
    }
}
