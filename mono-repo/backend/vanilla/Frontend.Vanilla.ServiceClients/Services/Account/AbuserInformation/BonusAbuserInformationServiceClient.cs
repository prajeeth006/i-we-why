using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Account.AbuserInformation;

internal interface IBonusAbuserInformationServiceClient : ICachedUserDataServiceClient<BonusAbuserInformationResponse> { }

internal sealed class BonusAbuserInformationServiceClient(IGetDataServiceClient getDataServiceClient)
    : CachedUserDataServiceClient<BonusAbuserInformationResponse, BonusAbuserInformationResponse>(getDataServiceClient,
        dataUrl: PosApiEndpoint.Account.GetDnaAbuserInformation,
        cacheKey: "DnaAbuserInformation"), IBonusAbuserInformationServiceClient
{
    // Used with distributed cache -> must match between products -> don't change!!!
}
