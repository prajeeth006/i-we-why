using Bwin.DynaCon.Api.Contracts.V1;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;

internal static class OverridesJsonExtensions
{
    public static JObject? GetFeatures(this JObject overridesJson)
        => (JObject?)overridesJson.GetValue(nameof(ConfigurationResponse.Configuration), OverridesJsonMerger.Comparison);
}
