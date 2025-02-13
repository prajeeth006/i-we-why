using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.SessionLimitsLogoutPopupClientConfigProvider;

public class SessionLimitsLogoutPopupClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private Mock<IVanillaClientContentService> clientContentService;

    public SessionLimitsLogoutPopupClientConfigProviderTests()
    {
        clientContentService = new Mock<IVanillaClientContentService>();

        Target = new SessionLimitsLogoutPopup.SessionLimitsLogoutPopupClientConfigProvider(clientContentService.Object);
    }

    [Fact]
    public async Task ShouldReturnContent()
    {
        await Target_GetConfigAsync();

        clientContentService.Verify(o => o.GetAsync("App-v1.0/SessionLimitsLogoutPopup/Content", It.IsAny<CancellationToken>(), It.IsAny<ContentLoadOptions>()));
    }
}
