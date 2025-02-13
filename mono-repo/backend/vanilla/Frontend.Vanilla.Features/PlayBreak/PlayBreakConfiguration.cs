using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.PlayBreak;

internal interface IPlayBreakConfiguration
{
    [Required]
    IDslExpression<bool> IsEnabledCondition { get; }
}

internal class PlayBreakConfiguration(IDslExpression<bool> isEnabledCondition) : IPlayBreakConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.PlayBreak";

    public IDslExpression<bool> IsEnabledCondition { get; } = isEnabledCondition;
}
