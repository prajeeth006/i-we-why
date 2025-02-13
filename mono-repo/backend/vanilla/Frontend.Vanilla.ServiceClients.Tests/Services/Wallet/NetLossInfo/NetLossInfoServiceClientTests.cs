using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Wallet.NetLossInfo;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.NetLossInfo;

public sealed class NetLossInfoServiceClientTests : ServiceClientTestsBase
{
    private INetLossInfoServiceClient target;

    protected override void Setup()
    {
        target = new NetLossInfoServiceClient(RestClient.Object, Cache.Object);
    }

    [Fact]
    public async Task ShouldCallUrlCorrectly()
    {
        RestClientResult = new NetLossInfoDto(34.9M, 34M, 98M);

        await target.GetAsync(TestMode.AsyncCancellationToken.Value, "user", 5, true);

        VerifyCache_GetOrCreateAsync<NetLossInfoDto>(PosApiDataType.User, "NetLossInfo-user-5", true);
        VerifyRestClient_ExecuteAsync("Wallet.svc/netLossInfo?level=user&days=5", authenticate: true, resultType: typeof(NetLossInfoDto));
    }
}
