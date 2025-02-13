using System.Net.Http;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.Balances;

public class TransferBalanceServiceClientTests : ServiceClientTestsBase
{
    private ITransferBalanceServiceClient target;

    protected override void Setup()
    {
        target = new TransferBalanceServiceClient(RestClient.Object);
    }

    [Fact]
    public void TransferAsync_ShouldExecuteCorrectly()
    {
        var transferBalance = new TransferBalance();
        var mode = TestExecutionMode.Get();

        target.TransferAsync(mode, transferBalance); // Act

        VerifyRestClient_ExecuteAsync(
            PosApiEndpoint.Wallet.BalanceTransfer.ToString(),
            HttpMethod.Post,
            true,
            null,
            true,
            transferBalance,
            null,
            mode);
    }
}
