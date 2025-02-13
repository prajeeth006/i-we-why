using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.PlayerGamingDeclaration;

internal interface IPlayerGamingDeclarationConfiguration
{
    [Required]
    IDslExpression<bool> IsEnabledCondition { get; }
}

internal sealed class PlayerGamingDeclarationConfiguration(IDslExpression<bool> isEnabledCondition) : IPlayerGamingDeclarationConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.PlayerGamingDeclaration";

    public IDslExpression<bool> IsEnabledCondition { get; set; } = isEnabledCondition;
}
