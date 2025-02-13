using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.Footer;

internal interface IFooterConfiguration
{
    IDslExpression<bool> Enabled { get; }
    bool ShowHelpButton { get; }
    bool ExpandableModeEnabled { get; }
    bool ShowLabelSwitcher { get; }
    ExpandableModeIcons ExpandableModeIcons { get; }
}

internal sealed class FooterConfiguration(
    IDslExpression<bool> enabled,
    bool showFooterClock,
    bool expandableModeEnabled,
    bool showLabelSwitcher,
    ExpandableModeIcons expandableModeIcons)
    : IFooterConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.Footer";

    public IDslExpression<bool> Enabled { get; set; } = enabled;

    public bool ShowHelpButton { get; set; } = showFooterClock;
    public bool ExpandableModeEnabled { get; set; } = expandableModeEnabled;
    public bool ShowLabelSwitcher { get; set; } = showLabelSwitcher;
    public ExpandableModeIcons ExpandableModeIcons { get; } = expandableModeIcons;
}

internal sealed class ExpandableModeIcons(string expanded, string collapsed)
{
    public string Expanded { get; } = expanded;
    public string Collapsed { get; } = collapsed;
}
