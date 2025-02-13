using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Features.RememberMeLogoutPrompt;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.RememberMe;

public class RememberMeLogoutPromptClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private Mock<IVanillaClientContentService> contentService;

    public RememberMeLogoutPromptClientConfigProviderTests()
    {
        contentService = new Mock<IVanillaClientContentService>();
        Target = new RememberMeLogoutPromptClientConfigProvider(contentService.Object);
    }

    [Fact]
    public async Task ShouldReturnRedirectMessageClientConfig()
    {
        var message = new ClientViewTemplate();
        contentService.Setup(c => c.GetAsync("App-v1.0/RememberMe/LogoutPrompt", Ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(message);

        var config = await Target_GetConfigAsync();

        config["content"].Should().Be(message);
    }
}
