using System;

namespace Frontend.Vanilla.Features.OfflinePage;

internal interface IOfflinePageConfiguration
{
    bool PollEnabled { get; }

    TimeSpan PollInterval { get; }
}

internal sealed class OfflinePageConfiguration(bool pollEnabled, TimeSpan pollInterval) : IOfflinePageConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.OfflinePage";

    public bool PollEnabled { get; set; } = pollEnabled;
    public TimeSpan PollInterval { get; set; } = pollInterval;
}
