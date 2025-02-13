using System.Collections.Generic;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.Header;

internal interface IHeaderConfiguration
{
    IDslExpression<bool> Enabled { get; }
    DisabledItems DisabledItems { get; }
    int Version { get; }
    bool OnboardingEnabled { get; }
    int HotspotLoginCount { get; }
    int PulseEffectLoginCount { get; }
    bool EnableToggleOnScroll { get; }
}

internal sealed class HeaderConfiguration(
    IDslExpression<bool> enabled,
    DisabledItems disabledItems,
    int version,
    bool onboardingEnabled,
    int hotspotLoginCount,
    int pulseEffectLoginCount,
    bool enableToggleOnScroll)
    : IHeaderConfiguration
{
    public const string FeatureName = "LabelHost.Header";

    public IDslExpression<bool> Enabled { get; set; } = enabled;
    public DisabledItems DisabledItems { get; set; } = disabledItems;
    public int Version { get; set; } = version;
    public bool OnboardingEnabled { get; set; } = onboardingEnabled;
    public int HotspotLoginCount { get; set; } = hotspotLoginCount;
    public int PulseEffectLoginCount { get; set; } = pulseEffectLoginCount;
    public bool EnableToggleOnScroll { get; set; } = enableToggleOnScroll;
}

internal sealed class DisabledItems(IDslExpression<bool> disabled, IList<string> features)
{
    public IDslExpression<bool> Disabled { get; set; } = disabled;
    public IList<string> Sections { get; set; } = features;
}
