using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Account.SofStatus;

internal interface ISofStatusDetailsServiceClient
{
    Task<SofStatusDetails> GetSofStatusDetailsAsync(ExecutionMode mode, bool cached);
}

internal sealed class SofStatusDetailsServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache, IClock clock) : ISofStatusDetailsServiceClient
{
    private const int UnsupportedJurisdiction = -2;

    public Task<SofStatusDetails> GetSofStatusDetailsAsync(ExecutionMode mode, bool cached)
    {
        return cache.GetOrCreateAsync(mode, PosApiDataType.User, "SofStatusDetails", () => GetSofStatusDetailsFreshAsync(mode));
    }

    private async Task<SofStatusDetails> GetSofStatusDetailsFreshAsync(ExecutionMode mode)
    {
        try
        {
            var result = await restClient.ExecuteAsync<SofStatusDetailsDto>(mode, new PosApiRestRequest(PosApiEndpoint.Account.SofStatusDetails)
            {
                Authenticate = true,
            });

            return new SofStatusDetails(result.SofStatus,
                result.RedStatusStartDate != null ? 28 - (clock.UtcNow.Value.Date - result.RedStatusStartDate.Value.Value.Date).TotalDays.ToInt32() : -1);
        }
        catch (PosApiException ex) when (ex.PosApiCode == UnsupportedJurisdiction)
        {
            return new SofStatusDetails();
        }
    }
}
