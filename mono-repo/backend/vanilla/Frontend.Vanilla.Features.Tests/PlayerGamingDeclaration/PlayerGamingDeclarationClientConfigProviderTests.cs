using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.PlayerGamingDeclaration;
using Frontend.Vanilla.Testing.AbstractTests;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.PlayerGamingDeclaration;

public class PlayerGamingDeclarationClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IPlayerGamingDeclarationConfiguration> playerGamingDeclarationConfigurationMock;
    private readonly Mock<IVanillaClientContentService> clientContentServiceMock;

    public PlayerGamingDeclarationClientConfigProviderTests()
    {
        clientContentServiceMock = new Mock<IVanillaClientContentService>();
        playerGamingDeclarationConfigurationMock = new Mock<IPlayerGamingDeclarationConfiguration>();

        Target = new PlayerGamingDeclarationClientConfigProvider(
            playerGamingDeclarationConfigurationMock.Object,
            clientContentServiceMock.Object,
            new TestLogger<PlayerGamingDeclarationClientConfigProvider>());
    }

    [Fact]
    public async Task GetClientConfigAsyncTest()
    {
        Target.Name.Should().Be("vnPlayerGamingDeclaration");
        var template = new ClientViewTemplate();

        clientContentServiceMock.Setup(c =>
                c.GetAsync($"{AppPlugin.ContentRoot}/GamingDeclaration/GamingDeclaration", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(template);

        var clientEvaluationResult = ClientEvaluationResult<bool>.FromClientExpression("exp");
        playerGamingDeclarationConfigurationMock.Setup(c => c.IsEnabledCondition.EvaluateForClientAsync(Ct)).ReturnsAsync(clientEvaluationResult);

        var config = await Target_GetConfigAsync();

        config["isEnabledCondition"].Should().BeSameAs(clientEvaluationResult);
        config["content"].Should().BeSameAs(template);
    }
}
