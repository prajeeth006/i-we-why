using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.LanguageSwitcher;

internal interface ILanguageSwitcherConfiguration
{
    IDslExpression<bool> IsEnabledDslExpression { get; }
    IDslExpression<bool> OpenPopupDslExpression { get; }
    IDslExpression<bool> ShowHeaderDslExpression { get; }
    int Version { get; }
    bool UseFastIcons { get; }
}

internal sealed class LanguageSwitcherConfiguration(
    IDslExpression<bool> openPopupDslExpression,
    IDslExpression<bool> isEnabledDslExpression,
    IDslExpression<bool> showHeaderDslExpression,
    int version, bool useFastIcons)
    : ILanguageSwitcherConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.UI.LanguageSwitcher";

    public IDslExpression<bool> OpenPopupDslExpression { get; set; } = openPopupDslExpression;
    public IDslExpression<bool> IsEnabledDslExpression { get; set; } = isEnabledDslExpression;
    public IDslExpression<bool> ShowHeaderDslExpression { get; set; } = showHeaderDslExpression;
    public int Version { get; set; } = version;
    public bool UseFastIcons { get; set; } = useFastIcons;
}
