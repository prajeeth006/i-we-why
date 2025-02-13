using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.LossLimits;

internal interface ILossLimitsConfiguration : IDisableableConfiguration
{
    int CloseWaitingTime { get; }
}

internal sealed class LossLimitsConfiguration : ILossLimitsConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.LossLimits";
    public int CloseWaitingTime { get; set; }
    public bool IsEnabled { get; set; }
}
