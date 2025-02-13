using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Account.AbuserInformation;

internal sealed class BonusAbuserInformationResponse(int valueSegmentId = 0, decimal sportsBettingFactor = 0.0m, bool isBonusAbuser = false)
    : IPosApiResponse<BonusAbuserInformationResponse>
{
    public int ValueSegmentId { get; } = valueSegmentId;

    public decimal SportsBettingFactor { get; } = sportsBettingFactor;

    public bool IsBonusAbuser { get; } = isBonusAbuser;

    BonusAbuserInformationResponse IPosApiResponse<BonusAbuserInformationResponse>.GetData() => this;
}
