using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Promohub.BonusAward;

internal sealed class BonusAwardDetailDto : IPosApiResponse<BonusAwardResponse>
{
    public IssuedBonusDto IssuedBonus { get; set; }

    public BonusAwardResponse GetData() => new BonusAwardResponse(issuedBonus: IssuedBonus?.GetData());
}

internal sealed class IssuedBonusDto : IPosApiResponse<IssuedBonus>
{
    public bool DirectAward { get; set; }
    public IssuedBonus GetData() => new IssuedBonus(directAward: DirectAward);
}
