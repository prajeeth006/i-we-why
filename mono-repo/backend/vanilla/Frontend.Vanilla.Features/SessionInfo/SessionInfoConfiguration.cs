using System.Collections.Generic;
using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.SessionInfo;

internal interface ISessionInfoConfiguration : IDisableableConfiguration
{
    IList<string> UrlBlacklist { get; }
    bool ShowWinningsLosses { get; }
    bool ShowTotalWager { get; }
    bool EnableLogoutButton { get; }
}

internal sealed class SessionInfoConfiguration : ISessionInfoConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.SessionInfo";
    public IList<string> UrlBlacklist { get; set; } = new List<string>();
    public bool IsEnabled { get; set; }
    public bool ShowWinningsLosses { get; set; }
    public bool EnableLogoutButton { get; set; }
    public bool ShowTotalWager { get; set; }
}
