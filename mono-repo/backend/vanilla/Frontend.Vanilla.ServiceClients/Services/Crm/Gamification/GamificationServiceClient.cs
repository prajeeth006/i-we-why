using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.Gamification;

internal interface IGamificationServiceClient
{
    Task<CoinsBalance> GetCoinBalance(ExecutionMode mode, CoinsBalanceRequest coinsBalanceRequest);
}

internal sealed class GamificationServiceClient(IPosApiRestClient restClient) : IGamificationServiceClient
{
    public async Task<CoinsBalance> GetCoinBalance(ExecutionMode mode, CoinsBalanceRequest coinsBalanceRequest)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.Crm.GamificationCoinsBalance, HttpMethod.Post)
        {
            Authenticate = true,
            Content = coinsBalanceRequest,
        };
        var response = await restClient.ExecuteAsync<CoinsBalance>(mode, request);

        return response.GetData();
    }
}
