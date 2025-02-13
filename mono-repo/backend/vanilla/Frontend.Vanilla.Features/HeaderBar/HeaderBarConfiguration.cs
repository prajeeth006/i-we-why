using System.Collections.Generic;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.HeaderBar;

internal interface IHeaderBarConfiguration
{
    IDictionary<int, CloseActionOptions> WorkflowCloseAction { get; }
    IDslExpression<bool> IsEnabledCondition { get; }
    IDslExpression<bool> DisableCloseCondition { get; }
    IDslExpression<bool> ShowBackButtonCondition { get; }
}

internal sealed class HeaderBarConfiguration(
    IDictionary<int, CloseActionOptions> workflowCloseAction,
    IDslExpression<bool> isEnabledCondition,
    IDslExpression<bool> disableCloseCondition,
    IDslExpression<bool> showBackButtonCondition)
    : IHeaderBarConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.UI.HeaderBar";

    public IDictionary<int, CloseActionOptions> WorkflowCloseAction { get; set; } = workflowCloseAction;
    public IDslExpression<bool> IsEnabledCondition { get; set; } = isEnabledCondition;
    public IDslExpression<bool> DisableCloseCondition { get; set; } = disableCloseCondition;
    public IDslExpression<bool> ShowBackButtonCondition { get; set; } = showBackButtonCondition;
}

internal sealed class CloseActionOptions
{
    public string Action { get; set; } = "";
    public object? Param { get; set; }
}
