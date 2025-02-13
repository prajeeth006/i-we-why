using System.Threading.Tasks;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Wallet.AverageDeposit;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.AverageDeposit;

public sealed class AverageDepositServiceClientTests : ServiceClientTestsBase
{
    private IAverageDepositServiceClient target;

    protected override void Setup()
    {
        target = new AverageDepositServiceClient(RestClient.Object, Cache.Object);
    }

    [Fact]
    public async Task ShouldCallUrlCorrectly()
    {
        RestClientResult = new AverageDepositDto(34.9M, 34M);

        if (TestMode.AsyncCancellationToken != null)
            await target.GetAsync(TestMode.AsyncCancellationToken.Value, 7, true);

        VerifyCache_GetOrCreateAsync<AverageDepositDto>(PosApiDataType.User, "AverageDepositValue");
        VerifyRestClient_ExecuteAsync(
            "Wallet.svc/AverageDepositValues?depositDays=7",
            authenticate: true,
            resultType: typeof(AverageDepositDto));
    }
}
