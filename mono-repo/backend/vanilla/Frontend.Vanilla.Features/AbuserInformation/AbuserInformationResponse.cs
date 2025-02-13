namespace Frontend.Vanilla.Features.AbuserInformation;

internal sealed class AbuserInformationResponse(bool isBonusAbuser)
{
    public bool IsBonusAbuser { get; } = isBonusAbuser;
}
