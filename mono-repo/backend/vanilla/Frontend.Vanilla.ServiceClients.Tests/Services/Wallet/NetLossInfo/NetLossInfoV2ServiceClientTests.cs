using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Wallet.NetLossInfo;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.NetLossInfo;

public sealed class NetLossInfoV2ServiceClientTests : ServiceClientTestsBase
{
    private INetLossInfoV2ServiceClient target;

    protected override void Setup()
    {
        target = new NetLossInfoV2ServiceClient(RestClient.Object, Cache.Object);
    }

    [Fact]
    public async Task ShouldCallUrlCorrectly()
    {
        RestClientResult = new NetLossInfoDto(34.9M, 34M, 98M);

        await target.GetAsync(TestMode.AsyncCancellationToken.Value, "user", new UtcDateTime(2021, 6, 1, 15, 0, 0, 0), new UtcDateTime(2021, 6, 7, 14, 23, 0, 0), true);

        VerifyCache_GetOrCreateAsync<NetLossInfoDto>(PosApiDataType.User, "NetLossInfoV2-user");
        VerifyRestClient_ExecuteAsync("Wallet.svc/netLossInfoV2?level=user&startTime=2021-06-01T15%3A00%3A00.0000000Z&endTime=2021-06-07T14%3A23%3A00.0000000Z",
            authenticate: true,
            resultType: typeof(NetLossInfoDto));
    }
}
