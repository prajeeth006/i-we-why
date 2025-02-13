using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;

internal interface ITransferBalanceServiceClient
{
    Task TransferAsync(ExecutionMode mode, TransferBalance transferBalance);
}

internal class TransferBalanceServiceClient(IPosApiRestClient restClient) : ITransferBalanceServiceClient
{
    public async Task TransferAsync(ExecutionMode mode, TransferBalance transferBalance)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.Wallet.BalanceTransfer, HttpMethod.Post)
        {
            Authenticate = true,
            Content = transferBalance,
        };

        await restClient.ExecuteAsync(mode, request);
    }
}
