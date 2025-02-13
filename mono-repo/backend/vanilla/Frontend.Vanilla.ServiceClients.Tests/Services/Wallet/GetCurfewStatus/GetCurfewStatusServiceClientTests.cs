using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Wallet.GetCurfewStatus;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.GetCurfewStatus;

public class GetCurfewStatusServiceClientTests : ServiceClientTestsBase
{
    private IGetCurfewStatusServiceClient target;

    protected override void Setup()
    {
        target = new GetCurfewStatusServiceClient(RestClient.Object, Cache.Object);
    }

    [Fact]
    public async Task ShouldCallUrlCorrectly()
    {
        RestClientResult = new GetCurfewStatusDto { IsDepositCurfewOn = true };

        await target.GetAsync(TestMode.AsyncCancellationToken.Value, true);

        VerifyCache_GetOrCreateAsync<GetCurfewStatusDto>(PosApiDataType.User, "GetCurfewStatus", true);
        VerifyRestClient_ExecuteAsync("Wallet.svc/Curfew/GetCurfewStatus", authenticate: true, resultType: typeof(GetCurfewStatusDto));
    }
}
