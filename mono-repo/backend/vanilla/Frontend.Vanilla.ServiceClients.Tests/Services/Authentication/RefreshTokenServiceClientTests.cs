using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Authentication;

public class RefreshTokenServiceClientTests : ServiceClientTestsBase
{
    private IRefreshTokenServiceClient target;

    protected override void Setup()
    {
        target = new RefreshTokenServiceClient(RestClient.Object);
    }

    [Fact]
    public async Task ShouldRefreshOnPosApi()
    {
        await target.RefreshAsync(TestMode); // Act

        VerifyRestClient_ExecuteAsync("Authentication.svc/Refresh", authenticate: true);
    }
}
