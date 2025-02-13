using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Wallet.ProfitLossSummary;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.ProfitLossSummary;

public sealed class ProfitLossSummaryServiceClientTests : ServiceClientTestsBase
{
    private IProfitLossSummaryServiceClient target;

    protected override void Setup()
    {
        target = new ProfitLossSummaryServiceClient(RestClient.Object, Cache.Object);
    }

    [Fact]
    public async Task ShouldCallUrlCorrectly()
    {
        RestClientResult = new ProfitLossSummaryDto(34.9M, 34M, 50M, 80M, 175M);

        await target.GetAsync(TestMode.AsyncCancellationToken.Value, new UtcDateTime(2021, 6, 1, 15, 0, 0, 0), new UtcDateTime(2021, 6, 7, 14, 23, 0, 0), "daily", true);

        VerifyCache_GetOrCreateAsync<ProfitLossSummaryDto>(PosApiDataType.User, "ProfitLossSummary-daily");
        VerifyRestClient_ExecuteAsync(
            "Wallet.svc/ProfitLossSummary?startDate=2021-06-01T15%3A00%3A00.0000000Z&endDate=2021-06-07T14%3A23%3A00.0000000Z&aggregationType=daily",
            authenticate: true,
            resultType: typeof(ProfitLossSummaryDto));
    }
}
