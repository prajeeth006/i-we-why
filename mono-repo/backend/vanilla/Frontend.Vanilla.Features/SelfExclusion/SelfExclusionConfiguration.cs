using System;

namespace Frontend.Vanilla.Features.SelfExclusion;

internal interface ISelfExclusionConfiguration
{
    TimeSpan UpdateInterval { get; }
}

internal sealed class SelfExclusionConfiguration(TimeSpan updateInterval) : ISelfExclusionConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.SelfExclusion";

    public TimeSpan UpdateInterval { get; } = updateInterval;
}
