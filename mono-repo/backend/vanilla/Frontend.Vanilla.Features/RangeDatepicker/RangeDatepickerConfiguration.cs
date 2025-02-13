using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.RangeDatepicker;

internal interface IRangeDatepickerConfiguration
{
    [Required]
    IDslExpression<bool> IsEnabledCondition { get; }
    int FirstDayOfWeek { get; }
}

internal sealed class RangeDatepickerConfiguration(IDslExpression<bool> isEnabledCondition, int firstDayOfWeek) : IRangeDatepickerConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.RangeDatepicker";

    public IDslExpression<bool> IsEnabledCondition { get; set; } = isEnabledCondition;
    public int FirstDayOfWeek { get; set; } = firstDayOfWeek;
}
