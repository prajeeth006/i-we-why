using System;
using System.Globalization;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.SignUpBonuses;

internal interface ISignUpBonusServiceClient
{
    Task<bool> BonusExistsAsync(ExecutionMode mode, int trackerId, string bonusStage);
    Task<SignUpBonusFlowContent> GetBonusFlowContentAsync(ExecutionMode mode, int trackerId, string bonusStage);
}

internal class SignUpBonusServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache) : ISignUpBonusServiceClient
{
    public const int BonusNotFoundPosApiCode = 103;
    public const int BonusFlowContentNotFoundPosApiCode = 103;

    public Task<bool> BonusExistsAsync(ExecutionMode mode, int trackerId, string bonusStage)
    {
        var cacheKey = $"SignUpBonusExists:{bonusStage}:{trackerId}:{CultureInfo.CurrentCulture}";

        return cache.GetOrCreateAsync(mode, PosApiDataType.Static, cacheKey, () => BonusExistsFreshAsync(mode, trackerId, bonusStage));
    }

    private async Task<bool> BonusExistsFreshAsync(ExecutionMode mode, int trackerId, string bonusStage)
    {
        Guard.NotWhiteSpace(bonusStage, nameof(bonusStage));

        try
        {
            // TODO: Read from PosApiEndpoint
            var url = new UriBuilder()
                .AppendPathSegment(PosApiServiceNames.Crm)
                .AppendPathSegment("BonusFlowContent")
                .AddQueryParameters(
                    ("trackerId", trackerId.ToInvariantString()),
                    ("stage", bonusStage),
                    ("language", CultureInfo.CurrentCulture.Name))
                .GetRelativeUri();

            await restClient.ExecuteAsync(mode, new PosApiRestRequest(url));

            return true;
        }
        catch (PosApiException ex) when (ex.PosApiCode == BonusNotFoundPosApiCode)
        {
            return false;
        }
    }

    public async Task<SignUpBonusFlowContent> GetBonusFlowContentAsync(ExecutionMode mode, int trackerId, string bonusStage)
    {
        Guard.NotWhiteSpace(bonusStage, nameof(bonusStage));

        try
        {
            var url = new UriBuilder()
                .AppendPathSegment(PosApiServiceNames.Crm)
                .AppendPathSegment("BonusFlowContent")
                .AddQueryParameters(
                    ("trackerId", trackerId.ToInvariantString()),
                    ("stage", bonusStage),
                    ("language", CultureInfo.CurrentCulture.Name))
                .GetRelativeUri();

            var result = await restClient.ExecuteAsync<SignUpBonusFlowContent>(mode, new PosApiRestRequest(url));
            result.TrackerId = trackerId;

            return result;
        }
        catch (PosApiException ex) when (ex.PosApiCode == BonusFlowContentNotFoundPosApiCode)
        {
            return new SignUpBonusFlowContent();
        }
    }
}
