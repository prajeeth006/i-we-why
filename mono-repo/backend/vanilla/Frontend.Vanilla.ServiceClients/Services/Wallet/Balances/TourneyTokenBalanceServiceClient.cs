using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;

internal interface ITourneyTokenBalanceServiceClient
{
    Task<TourneyTokenBalanceDto> GetAsync(ExecutionMode mode);
}

internal sealed class TourneyTokenBalanceServiceClient(IPosApiRestClient restClient) : ITourneyTokenBalanceServiceClient
{
    public async Task<TourneyTokenBalanceDto> GetAsync(ExecutionMode mode)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.Wallet.TourneyTokenBalance) { Authenticate = true };
        var response = await restClient.ExecuteAsync<TourneyTokenBalanceResponse>(mode, request);

        if (response.TourneyTokenBalance < 0)
        {
            response.TourneyTokenBalance = 0;

            return TourneyTokenBalanceDto.Create(response, string.Empty);
        }

        return TourneyTokenBalanceDto.Create(response, response.TourneyTokenCurrency);
    }
}
