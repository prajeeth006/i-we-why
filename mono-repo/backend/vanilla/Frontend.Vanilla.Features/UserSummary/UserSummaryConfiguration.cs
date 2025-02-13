using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.UserSummary;

internal interface IUserSummaryConfiguration : IDisableableConfiguration
{
    bool SkipOverlay { get; }
}

internal sealed class UserSummaryConfiguration : IUserSummaryConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.UserSummary";

    public bool IsEnabled { get; set; }
    public bool SkipOverlay { get; set; }
}
