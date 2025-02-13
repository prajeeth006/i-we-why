using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.LabelSwitcher;

internal interface ILabelSwitcherConfiguration : IDisableableConfiguration
{
    IDslExpression<bool> ShowChangeLabelToasterCondition { get; }
    IDslExpression<bool> IsRestrictedAccessCondition { get; }
    bool ShowOnEveryStateSwitchWhenEnabled { get; }
    bool PersistStayInState { get; }
}

internal sealed class LabelSwitcherConfiguration(
    bool isEnabled,
    IDslExpression<bool> showChangeLabelToasterCondition,
    IDslExpression<bool> isRestrictedAccessCondition,
    bool showOnEveryStateSwitchWhenEnabled,
    bool persistStayInState)
    : ILabelSwitcherConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.LabelSwitcher";

    public bool IsEnabled { get; } = isEnabled;
    public IDslExpression<bool> ShowChangeLabelToasterCondition { get; } = showChangeLabelToasterCondition;
    public IDslExpression<bool> IsRestrictedAccessCondition { get; } = isRestrictedAccessCondition;
    public bool ShowOnEveryStateSwitchWhenEnabled { get; } = showOnEveryStateSwitchWhenEnabled;
    public bool PersistStayInState { get; } = persistStayInState;
}
