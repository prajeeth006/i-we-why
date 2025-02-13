using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.ServiceClients.Services.Promohub.BonusAward;

internal sealed class PosApiBonusAwardServiceClient(IPosApiRestClient restClient, ILogger<PosApiBonusAwardServiceClient> log) : IPosApiBonusAwardServiceClient
{
    private static UriBuilder DataUrl => new UriBuilder()
        .AppendPathSegment(PosApiServiceNames.PromoHub);

    public async Task<BonusAwardResponse> GetBonusAwardAsync(ExecutionMode mode, string offerId)
    {
        try
        {
            var request = new PosApiRestRequest(DataUrl
                .AppendPathSegment("details")
                .AppendPathSegment("bonus")
                .AppendPathSegment(offerId)
                .AppendPathSegment("award")
                .GetRelativeUri())
            {
                Authenticate = true,
            };

            var response = await restClient.ExecuteAsync<BonusAwardDetailDto>(mode, request);

            return response?.GetData();
        }
        catch (PosApiException ex) when (ex.PosApiCode is ErrorCodes.NoUserdataFound or ErrorCodes.InternalServerError)
        {
            log.LogWarning("Unable to fetch bonus award detail data");

            return new BonusAwardResponse(new IssuedBonus(false));
        }
    }
}

internal static class ErrorCodes
{
    public const int NoUserdataFound = 1001;
    public const int InternalServerError = 101;
}
