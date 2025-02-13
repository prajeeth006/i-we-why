namespace Frontend.Vanilla.Features.Tooltips;

internal interface ITooltipsConfiguration
{
    bool IsOnboardingTooltipsEnabled { get; }
    bool IsTutorialTooltipsEnabled { get; }
}

internal class TooltipsConfiguration(bool isOnboardingTooltipsEnabled, bool isTutorialTooltipsEnabled) : ITooltipsConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.Tooltips";

    public bool IsOnboardingTooltipsEnabled { get; set; } = isOnboardingTooltipsEnabled;
    public bool IsTutorialTooltipsEnabled { get; set; } = isTutorialTooltipsEnabled;
}
