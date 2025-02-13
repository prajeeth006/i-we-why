using System;

namespace Frontend.Vanilla.Features.ScreenTime;

internal interface IScreenTimeConfiguration
{
    TimeSpan MinimumScreenTime { get; }
    TimeSpan MinimumUpdateInterval { get; }
    TimeSpan IdleTimeout { get; }
}

internal sealed class ScreenTimeConfiguration : IScreenTimeConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.ScreenTime";
    public TimeSpan MinimumScreenTime { get; set; }
    public TimeSpan MinimumUpdateInterval { get; set; }
    public TimeSpan IdleTimeout { get; set; }
}
