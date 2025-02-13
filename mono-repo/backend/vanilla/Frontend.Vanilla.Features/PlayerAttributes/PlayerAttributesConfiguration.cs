using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.PlayerAttributes;

internal interface IPlayerAttributesConfiguration
{
    [Required]
    IDslExpression<bool> IsEnabledCondition { get; }
}

internal class PlayerAttributesConfiguration(IDslExpression<bool> isEnabledCondition) : IPlayerAttributesConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.PlayerAttributes";

    public IDslExpression<bool> IsEnabledCondition { get; } = isEnabledCondition;
}
