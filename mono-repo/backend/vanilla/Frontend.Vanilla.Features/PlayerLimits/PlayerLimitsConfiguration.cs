using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.PlayerLimits;

internal interface IPlayerLimitsConfiguration : IDisableableConfiguration { }

internal sealed class PlayerLimitsConfiguration : IPlayerLimitsConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.PlayerLimits";
    public bool IsEnabled { get; set; }
}
