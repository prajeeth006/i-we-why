using System.Collections.Generic;

namespace Frontend.Vanilla.Features.LazyFeatures;

internal interface ILazyFeaturesConfiguration
{
    string DefaultStrategy { get; }
    Dictionary<string, FeatureOptions> Rules { get; }
    Dictionary<string, StrategyOptions> Strategies { get; }
}

internal sealed class LazyFeaturesConfiguration(string defaultStrategy, Dictionary<string, StrategyOptions> strategies, Dictionary<string, FeatureOptions> rules)
    : ILazyFeaturesConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.LazyFeatures";

    public string DefaultStrategy { get; set; } = defaultStrategy;
    public Dictionary<string, FeatureOptions> Rules { get; set; } = rules;
    public Dictionary<string, StrategyOptions> Strategies { get; set; } = strategies;
}
