using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.PlayerWagerSession;

internal interface IPlayerActiveWagerServiceClient
{
    Task<ActiveWagerDetails> GetActiveWagerDetails(ExecutionMode mode);
}

internal class PlayerActiveWagerServiceClient(IPosApiRestClient restClient) : IPlayerActiveWagerServiceClient
{
    public async Task<ActiveWagerDetails> GetActiveWagerDetails(ExecutionMode mode)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.Wallet.ActiveWagerDetails) { Authenticate = true };
        var response = await restClient.ExecuteAsync<ActiveWagerDetails>(mode, request);

        return response.GetData();
    }
}
