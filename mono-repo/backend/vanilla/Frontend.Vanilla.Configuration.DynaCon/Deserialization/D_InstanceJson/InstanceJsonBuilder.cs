using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.E_Context;
using Frontend.Vanilla.Core.System.Text;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.D_InstanceJson;

/// <summary>
/// Constructs JSON for all properties of a feature according to given context.
/// </summary>
internal interface IInstanceJsonBuilder
{
    JObject BuildForContext(IReadOnlyDictionary<string, KeyConfiguration> featureDto, VariationContext context, VariationHierarchyResponse contextHierarchy);
}

internal sealed class InstanceJsonBuilder : IInstanceJsonBuilder
{
    public JObject BuildForContext(IReadOnlyDictionary<string, KeyConfiguration> featureDto, VariationContext context, VariationHierarchyResponse contextHierarchy)
    {
        var json = new JObject();

        foreach (var pair in featureDto)
        {
            var values = pair.Value.Values
                .Where(v => IsMatch(v, context, contextHierarchy))
                .OrderBy(v => v.Priority)
                .Select(v => v.Value != null ? JToken.FromObject(v.Value) : JValue.CreateNull());

            JToken value = new JObject();

            foreach (var toMerge in values)
            {
                if (value is JObject primary && toMerge is JObject overrides)
                    primary.Merge(overrides, new JsonMergeSettings
                    {
                        MergeArrayHandling = MergeArrayHandling.Replace,
                        MergeNullValueHandling = MergeNullValueHandling.Merge,
                    });
                else
                    value = toMerge;
            }

            json.Add(pair.Key, value);
        }

        return json;
    }

    public bool IsMatch(ValueConfiguration value, VariationContext context, VariationHierarchyResponse contextHierarchy)
        // Properties of requested context for which we are building the JSON must be subset of value context properties.
        // E.g. requested context [qa2, dev] and value context:
        // - [qa, qa2, dev] => true
        // - [qa2, dev] => true
        // - [dev] => false
        // - [qa3] => false
        => value.Context.All(c =>
        {
            if (!context.Properties.TryGetValue(c.Key, out var requestedProps))
                return false; // E.g. value is contrainted to label = [bwin.com] but requested context is for any label

            // ReSharper disable once RedundantCast
            var valueProps = contextHierarchy.GetChildren(c.Key, c.Value).Append((TrimmedRequiredString)c.Value);

            return requestedProps.IsSubsetOf(valueProps);
        });
}
