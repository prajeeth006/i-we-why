namespace Frontend.Vanilla.ServiceClients.Services.Crm2.Models;

/// <summary>
/// Bonus TNC Acceptance Model.
/// </summary>
public sealed class BonusTncAcceptance
{
    /// <summary>
    /// Offer Id.
    /// </summary>
    public int OfferId { get; set; }

    /// <summary>
    /// Offer Arc.
    /// </summary>
    public int OfferArc { get; set; }

    /// <summary>
    /// Is Campaign bonus.
    /// </summary>
    public bool IsCampaignBonus { get; set; }

    /// <summary>
    /// Tnc Acceptance Flag.
    /// </summary>
    public bool TncAcceptanceFlag { get; set; }
}
