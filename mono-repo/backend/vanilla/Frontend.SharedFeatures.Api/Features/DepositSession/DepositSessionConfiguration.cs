using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.SharedFeatures.Api.Features.DepositSession;

internal interface IDepositSessionConfiguration
{
    [Required]
    IDslExpression<bool> IsEnabledCondition { get; }
}

internal sealed class DepositSessionConfiguration(IDslExpression<bool> isEnabledCondition) : IDepositSessionConfiguration
{
    public const string FeatureName = "SFAPI.Features.DepositSession";

    public IDslExpression<bool> IsEnabledCondition { get; } = isEnabledCondition;
}
