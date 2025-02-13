using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features.UserSummary;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.UserSummary;

public class UserSummaryClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IUserSummaryConfiguration> userSummaryConfigurationMock;
    private readonly Mock<IVanillaClientContentService> clientContentServiceMock;
    private readonly Mock<IMenuFactory> menuFactoryMock;

    public UserSummaryClientConfigProviderTests()
    {
        userSummaryConfigurationMock = new Mock<IUserSummaryConfiguration>();
        clientContentServiceMock = new Mock<IVanillaClientContentService>();
        menuFactoryMock = new Mock<IMenuFactory>();

        Target = new UserSummaryClientConfigProvider(clientContentServiceMock.Object, userSummaryConfigurationMock.Object, menuFactoryMock.Object);
    }

    [Fact]
    public async Task ClientConfig_ShouldReturnContentMessages()
    {
        userSummaryConfigurationMock.SetupGet(c => c.SkipOverlay).Returns(true);
        var template = new ClientViewTemplate();
        clientContentServiceMock.Setup(c => c.GetAsync("App-v1.0/UserSummary/Messages", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(template);

        var section = new MenuSection { Items = new[] { new MenuItem() } };
        menuFactoryMock.Setup(c => c.GetSectionAsync("App-v1.0/UserSummary/SummaryItems", It.Is<DslEvaluation>(e => e == DslEvaluation.PartialForClient), Ct))
            .ReturnsAsync(section);

        var config = await Target_GetConfigAsync();

        config["skipOverlay"].Should().Be(true);
        config["template"].Should().Be(template);
        config["summaryItems"].Should().Be(section.Items);
    }
}
