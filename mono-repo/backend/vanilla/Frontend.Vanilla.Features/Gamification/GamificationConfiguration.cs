using System.ComponentModel.DataAnnotations;

namespace Frontend.Vanilla.Features.Gamification;

internal interface IGamificationConfiguration
{
    [Required]
    int CoinsExpiringInDays { get; }
}

internal class GamificationConfiguration(int coinsExpiringInDays) : IGamificationConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.Gamification";

    public int CoinsExpiringInDays { get; } = coinsExpiringInDays;
}
