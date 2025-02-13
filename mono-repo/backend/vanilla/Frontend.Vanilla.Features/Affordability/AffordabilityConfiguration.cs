using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.Affordability;

internal interface IAffordabilityConfiguration
{
    [Required]
    IDslExpression<bool> IsEnabledCondition { get; }
}

internal sealed class AffordabilityConfiguration(IDslExpression<bool> isEnabledCondition) : IAffordabilityConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.Affordability";

    public IDslExpression<bool> IsEnabledCondition { get; } = isEnabledCondition;
}
