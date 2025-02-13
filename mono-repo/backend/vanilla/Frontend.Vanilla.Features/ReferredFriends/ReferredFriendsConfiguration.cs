using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.ReferredFriends;

internal interface IReferredFriendsConfiguration
{
    [Required]
    IDslExpression<bool> IsEnabledCondition { get; }
}

internal class ReferredFriendsConfiguration(IDslExpression<bool> isEnabledCondition) : IReferredFriendsConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.ReferredFriends";

    public IDslExpression<bool> IsEnabledCondition { get; } = isEnabledCondition;
}
