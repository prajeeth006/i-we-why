using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.BottomNav;

internal interface IBottomNavConfiguration
{
    [Required]
    IDslExpression<bool> IsEnabled { get; }
}

internal class BottomNavConfiguration(IDslExpression<bool> isEnabled) : IBottomNavConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.UI.BottomNav";

    public IDslExpression<bool> IsEnabled { get; set; } = isEnabled;
}
