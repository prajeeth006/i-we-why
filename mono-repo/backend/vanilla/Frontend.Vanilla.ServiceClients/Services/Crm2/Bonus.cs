namespace Frontend.Vanilla.ServiceClients.Services.Crm2;

internal sealed class Bonus
{
    public BonusStatusVanilla BonusStatusVanilla { get; set; }
    public BonusOfferType BonusOfferType { get; set; }
    public string BonusCode { get; set; }
    public string AccountCurrencyCode { get; set; }
    public decimal BonusOfferMaxAmount { get; set; }
}
