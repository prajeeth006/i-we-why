using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.SelfExclusion;

internal interface ISelfExclusionServiceClient
{
    Task<SelfExclusionDetails> GetSelfExclusionDetailsAsync(ExecutionMode mode);
}

internal sealed class SelfExclusionServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache) : ISelfExclusionServiceClient
{
    private const int UserIsNotInCoolOffStatusPosApiCode = 102;

    public Task<SelfExclusionDetails> GetSelfExclusionDetailsAsync(ExecutionMode mode)
    {
        return cache.GetOrCreateAsync(mode, PosApiDataType.User, "SelfExclusionDetails", () => GetSelfExclusionDetailsFreshAsync(mode));
    }

    private async Task<SelfExclusionDetails> GetSelfExclusionDetailsFreshAsync(ExecutionMode mode)
    {
        try
        {
            return await restClient.ExecuteAsync<SelfExclusionDetails>(mode, new PosApiRestRequest(PosApiEndpoint.ResponsibleGaming.SelfExclusionDetails)
            {
                Authenticate = true,
            });
        }
        catch (PosApiException ex) when (ex.PosApiCode == UserIsNotInCoolOffStatusPosApiCode)
        {
            return new SelfExclusionDetails(null, null, null);
        }
    }
}
