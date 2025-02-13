using Frontend.Vanilla.Core.Validation.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyPoint;

/// <summary>
/// Configures loyalty profile handling.
/// </summary>
internal interface ILoyaltyConfiguration
{
    /// <summary>
    /// Configures what type of balance of loyalty points should be displayed.
    /// </summary>
    LoyaltyPointsBalance Points { get; }
}

internal enum LoyaltyPointsBalance
{
    Total,
    ThisWeek,
}

internal sealed class LoyaltyConfiguration : ILoyaltyConfiguration
{
    [DefinedEnumValue]
    public LoyaltyPointsBalance Points { get; set; }
}
