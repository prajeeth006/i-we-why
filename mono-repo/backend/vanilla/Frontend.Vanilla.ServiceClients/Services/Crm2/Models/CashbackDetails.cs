namespace Frontend.Vanilla.ServiceClients.Services.Crm2.Models;

internal sealed class CashbackDetails
{
    public bool OptinStatus { get; set; }

    public decimal CashbackAmount { get; set; }

    public string CashbackCurrency { get; set; }

    public bool EligibleForClaim { get; set; }

    public decimal ClaimedAmount { get; set; }

    public string ClaimedAmountCurrency { get; set; }

    public decimal MinEligibleAmount { get; set; }

    public string MinEligibleAmountCurrency { get; set; }
}

internal sealed class CashbackDetailsV2
{
    public bool OptinStatus { get; set; }

    public decimal CashbackAmount { get; set; }

    public string CashbackCurrency { get; set; }

    public bool EligibleForClaim { get; set; }

    public decimal ClaimedAmount { get; set; }

    public string ClaimedAmountCurrency { get; set; }

    public decimal CurrentPoints { get; set; }

    public decimal LifeTimePoints { get; set; }
    public decimal PointsBalanceAfterClaim { get; set; }
    public decimal MinPointsReqForRedeem { get; set; }
}
