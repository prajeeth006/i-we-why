using System;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.ActivityPopup;

internal interface IActivityPopupConfiguration
{
    IDslExpression<bool> IsEnabledCondition { get; }
    TimeSpan Timeout { get; }
}

internal sealed class ActivityPopupConfiguration(IDslExpression<bool> isEnabledCondition, TimeSpan timeout) : IActivityPopupConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.ActivityPopup";

    public IDslExpression<bool> IsEnabledCondition { get; set; } = isEnabledCondition;
    public TimeSpan Timeout { get; set; } = timeout;
}
