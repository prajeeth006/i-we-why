using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.Offers;

internal interface IOffersConfiguration
{
    bool OffersCountEnabled { get; }
    int UpdateInterval { get; }
    IDslExpression<bool> OfferButtonEnabledCondition { get; }
    bool OfferButtonV2 { get; }
}

internal sealed class OffersConfiguration(bool offersCountEnabled, int updateInterval, IDslExpression<bool> offerButtonEnabledCondition, bool offerButtonV2)
    : IOffersConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.Offers";

    public bool OffersCountEnabled { get; set; } = offersCountEnabled;
    public int UpdateInterval { get; set; } = updateInterval;
    public IDslExpression<bool> OfferButtonEnabledCondition { get; set; } = offerButtonEnabledCondition;
    public bool OfferButtonV2 { get; set; } = offerButtonV2;
}
