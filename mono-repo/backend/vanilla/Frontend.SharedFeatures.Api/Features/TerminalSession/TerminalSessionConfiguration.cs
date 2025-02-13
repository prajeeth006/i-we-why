using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.SharedFeatures.Api.Features.TerminalSession;

internal interface ITerminalSessionConfiguration
{
    [Required]
    IDslExpression<bool> IsEnabledCondition { get; }

    [Required]
    TimeSpan DepositAlertTimeSpan { get; }
}

internal sealed class TerminalSessionConfiguration(IDslExpression<bool> isEnabledCondition, TimeSpan depositAlertTimeSpan) : ITerminalSessionConfiguration
{
    public const string FeatureName = "SFAPI.Features.TerminalSession";

    public IDslExpression<bool> IsEnabledCondition { get; } = isEnabledCondition;
    public TimeSpan DepositAlertTimeSpan { get; } = depositAlertTimeSpan;
}
