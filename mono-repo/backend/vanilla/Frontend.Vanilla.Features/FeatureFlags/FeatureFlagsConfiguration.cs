using System.Collections.Generic;

namespace Frontend.Vanilla.Features.FeatureFlags;

internal interface IFeatureFlagsConfiguration
{
    IReadOnlyDictionary<string, bool> FeatureFlags { get; }
}

internal sealed class FeatureFlagsConfiguration(IReadOnlyDictionary<string, bool> featureFlags) : IFeatureFlagsConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.Flags";

    public IReadOnlyDictionary<string, bool> FeatureFlags { get; } = featureFlags;
}
