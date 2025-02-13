using System;

namespace Frontend.Vanilla.Features.InactivityScreen;

internal interface IInactivityScreenConfiguration
{
    string Mode { get; }
    TimeSpan IdleTimeout { get; }
    TimeSpan CountdownTimeout { get; }
    bool EnableSessionPopup { get; }
    TimeSpan MaxOffsetForIdleTimeout { get; }
    bool ShowLogoutButton { get; }
    bool ShowOkButton { get; }
    bool ShowHeaderCloseButton { get; }
    bool ProlongSession { get; }
    int WebVersion { get; }
}

internal sealed class InactivityScreenConfiguration(
    string mode,
    TimeSpan idleTimeout,
    TimeSpan countdownTimeout,
    bool enableSessionPopup,
    TimeSpan maxOffsetForIdleTimeout,
    bool showLogoutButton,
    bool showOkButton,
    bool showHeaderCloseButton,
    bool prolongSession,
    int webVersion
    )
    : IInactivityScreenConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.InactivityScreen";

    public string Mode { get; } = mode;
    public TimeSpan IdleTimeout { get; } = idleTimeout;
    public TimeSpan CountdownTimeout { get; } = countdownTimeout;
    public bool EnableSessionPopup { get; } = enableSessionPopup;
    public TimeSpan MaxOffsetForIdleTimeout { get; } = maxOffsetForIdleTimeout;
    public bool ShowLogoutButton { get; } = showLogoutButton;
    public bool ShowOkButton { get; } = showOkButton;
    public bool ShowHeaderCloseButton { get; } = showHeaderCloseButton;
    public bool ProlongSession { get; } = prolongSession;
    public int WebVersion { get; } = webVersion;
}
