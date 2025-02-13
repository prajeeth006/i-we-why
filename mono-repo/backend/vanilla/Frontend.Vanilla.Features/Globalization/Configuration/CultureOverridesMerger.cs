using System.Collections.Generic;
using System.Globalization;
using Frontend.Vanilla.Core.System.Text;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.Globalization.Configuration;

/// <summary>
/// Merges different culture overrides (JSON objects) from a CultureInfo hierachy chain (e.g. "", "en", "en-US").
/// It does it in a top-down way so that the most specific culture has the highest priority.
/// </summary>
internal interface ICultureOverridesMerger
{
    /// <summary>
    /// Returns merged culture overrides for a given culture.
    /// </summary>
    /// <param name="culture">The CultureInfo instance to use to lookup the culture overrides dictionary.</param>
    /// <param name="cultureOverrides">Dictionary of culture overrides per culture.</param>
    /// <returns>Merged culture overrides.</returns>
    JObject MergeOverridesChain(CultureInfo culture, IReadOnlyDictionary<string, JObject> cultureOverrides);
}

internal class CultureOverridesMerger : ICultureOverridesMerger
{
    public JObject MergeOverridesChain(CultureInfo culture, IReadOnlyDictionary<string, JObject> cultureOverrides)
    {
        var mergedOverride = new JObject();
        MergeAllCultureChainOverridesTopDown(culture, cultureOverrides, mergedOverride);

        return mergedOverride;
    }

    private void MergeAllCultureChainOverridesTopDown(CultureInfo culture, IReadOnlyDictionary<string, JObject> cultureOverrides, JObject result)
    {
        if (!culture.Equals(CultureInfo.InvariantCulture))
            MergeAllCultureChainOverridesTopDown(culture.Parent, cultureOverrides, result);

        // Unlike in .NET where the invariant culture name is an empty string, we rather use
        // the "any" string in our configuration instead.
        var cultureName = culture.Name.WhiteSpaceToNull() ?? "any";
        var cultureOverride = cultureOverrides.ContainsKey(cultureName) ? cultureOverrides[cultureName] : new JObject();

        result.Merge(cultureOverride, new JsonMergeSettings { MergeArrayHandling = MergeArrayHandling.Replace });
    }
}
