namespace Frontend.Vanilla.ServiceClients.Services.Promohub.BonusAward;

internal sealed class BonusAwardResponse(IssuedBonus issuedBonus = default)
{
    public IssuedBonus IssuedBonus { get; set; } = issuedBonus;
}

internal sealed class IssuedBonus(bool directAward)
{
    public bool DirectAward { get; set; } = directAward;
}
