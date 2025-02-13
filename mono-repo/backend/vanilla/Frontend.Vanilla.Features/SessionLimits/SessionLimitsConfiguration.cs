using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.SessionLimits;

internal interface ISessionLimitsConfiguration : IDisableableConfiguration
{
    int CloseWaitingTime { get; }
    bool IsAutoLogoutEnabled { get; }
    bool SkipOverlay { get; }
    int Version { get; }
}

internal sealed class SessionLimitsConfiguration : ISessionLimitsConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.SessionLimits";
    public int CloseWaitingTime { get; set; }
    public bool IsEnabled { get; set; }
    public bool IsAutoLogoutEnabled { get; set; }
    public bool SkipOverlay { get; set; }
    public int Version { get; set; }
}
