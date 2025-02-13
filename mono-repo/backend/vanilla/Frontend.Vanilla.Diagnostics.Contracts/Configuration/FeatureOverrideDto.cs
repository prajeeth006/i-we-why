using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Diagnostics.Contracts.Configuration;

public sealed class FeatureOverrideDto(string featureName, JObject json)
{
    public string FeatureName { get; } = featureName;
    public JObject Json { get; } = json;
}
