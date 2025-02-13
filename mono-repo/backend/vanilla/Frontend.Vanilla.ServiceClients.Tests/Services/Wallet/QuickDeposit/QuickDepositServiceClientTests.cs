using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Wallet.QuickDeposit;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.QuickDeposit;

public class QuickDepositServiceClientTests : ServiceClientTestsBase
{
    private IQuickDepositServiceClient target;

    protected override void Setup()
    {
        target = new QuickDepositServiceClient(RestClient.Object);
    }

    [Fact]
    public async Task ShouldCallUrlCorrectly()
    {
        RestClientResult = new QuickDepositInfoDto { IsQuickDepositAllowed = true };

        var result = await target.GetAsync(TestMode.AsyncCancellationToken.Value);

        result.Should().Be(true);
        VerifyRestClient_ExecuteAsync("Wallet.svc/QuickDeposit", authenticate: true, resultType: typeof(QuickDepositInfoDto));
    }
}
