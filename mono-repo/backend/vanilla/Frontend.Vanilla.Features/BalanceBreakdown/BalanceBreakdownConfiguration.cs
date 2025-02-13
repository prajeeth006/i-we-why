using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.BalanceBreakdown;

internal interface IBalanceBreakdownConfiguration
{
    IDslExpression<bool> PaypalBalanceMessageEnabled { get; }
    IDslExpression<bool> PaypalReleaseFundsEnabled { get; }
    bool UseV2 { get; }
}

internal class BalanceBreakdownConfiguration(IDslExpression<bool> paypalBalanceMessageEnabled, IDslExpression<bool> paypalReleaseFundsEnabled, bool useV2)
    : IBalanceBreakdownConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.BalanceBreakdown";

    public IDslExpression<bool> PaypalBalanceMessageEnabled { get; set; } = paypalBalanceMessageEnabled;
    public IDslExpression<bool> PaypalReleaseFundsEnabled { get; set; } = paypalReleaseFundsEnabled;
    public bool UseV2 { get; set; } = useV2;
}
