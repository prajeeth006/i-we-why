using System;
using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;

/// <summary>
/// Merges given JSON object with configuration overrides to primary one.
/// </summary>
internal interface IOverridesJsonMerger
{
    void Merge(JObject primary, JObject overrides);
}

internal sealed class OverridesJsonMerger : IOverridesJsonMerger
{
    public const StringComparison Comparison = StringComparison.OrdinalIgnoreCase;

    public void Merge(JObject primary, JObject overrides)
    {
        try
        {
            MergeInternal(primary, overrides);
        }
        catch (Exception ex)
        {
            throw new Exception("Failed merging local file overrides into respond from DynaCon at JSON level", ex);
        }
    }

    private void MergeInternal(JObject primary, JObject overrides)
    {
        foreach (var property in overrides.Properties())
        {
            var primaryValue = primary.GetValue(property.Name, Comparison);

            if (primaryValue?.Type == JTokenType.Array && IsDynaConKeyValuesProperty(property)) // Special case: merging by context
            {
                MergeValuesByDynaConContext((JArray)primaryValue, (JArray)property.Value);
            }
            else if (primaryValue?.Type == JTokenType.Object && property.Value.Type == JTokenType.Object)
            {
                MergeInternal((JObject)primaryValue, (JObject)property.Value);
                AddDummyDataTypeIfMissing(primaryValue);
            }
            else if (property.Value.Type == JTokenType.Undefined)
            {
                primary.Remove(property.Name, Comparison);
            }
            else
            {
                primary.Set(property.Name, Comparison, property.Value);
            }
        }
    }

    private void MergeValuesByDynaConContext(JArray primaryValues, JArray overrideValues)
    {
        var previousContexts = new List<JObject>(overrideValues.Count);

        foreach (var overrideValue in overrideValues.Select(v => (JObject)v.DeepClone())) // Clone so that we don't modify original object
        {
            var context = GetContext(overrideValue);

            if (previousContexts.Any(c => EqualContexts(c, context)))
                throw new Exception($"There are multiple values at path '{overrideValues.Path}' with context: {context}");

            previousContexts.Add(context);
            var primaryValue = primaryValues.Cast<JObject>().FirstOrDefault(v => EqualContexts(context, GetContext(v)));

            if (primaryValue != null)
            {
                overrideValue.Remove(nameof(ValueConfiguration.Context), Comparison); // Same as primary context -> no need to merge it in
                Merge(primaryValue, overrideValue);
            }
            else
            {
                overrideValue.Set(nameof(ValueConfiguration.Context), Comparison, context); // Set cleaned context
                primaryValues.Add(overrideValue);
            }
        }
    }

    private static JObject GetContext(JObject json)
    {
        var token = json.GetValue(nameof(ValueConfiguration.Context), Comparison);

        return token != null && token.Type != JTokenType.Null ? (JObject)token : new JObject();
    }

    private static bool EqualContexts(JObject context1, JObject context2)
    {
        if (context1.Count != context2.Count)
            return false;

        return context1.Properties().All(
            property =>
            {
                var otherValue = context2.GetValue(property.Name, Comparison);

                if (otherValue == null)
                    return false;

                return property.Value.Type == JTokenType.String
                    ? ((string)property!).Equals((string)otherValue!, Comparison)
                    : property.Value.Equals(otherValue);
            });
    }

    private static bool IsDynaConKeyObject(JToken? json)
    {
        if (json?.Type != JTokenType.Object)
            return false;

        // 6_RootObject.5_ConfigurationProperty.4_ConfigurationObject.3_FeatureProperty.2_FeatureObject.1_KeyProperty.KeyObject
        var rootConfigProp = json.Parent?.Parent?.Parent?.Parent?.Parent as JProperty;

        return nameof(ConfigurationResponse.Configuration).Equals(rootConfigProp?.Name, Comparison) && json.Root == rootConfigProp?.Parent;
    }

    private static bool IsDynaConKeyValuesProperty(JProperty property)
        => property.Value.Type == JTokenType.Array
           && property.Name.Equals(nameof(KeyConfiguration.Values), Comparison)
           && IsDynaConKeyObject(property.Parent);

    // Add dummy DataType so that developers don't need to specify it for newly added keys
    private static void AddDummyDataTypeIfMissing(JToken json)
    {
        foreach (var prop in ((json as JObject)?.Properties()).NullToEmpty())
            if (IsDynaConKeyObject(prop.Value))
            {
                var obj = (JObject)prop.Value;
                if (obj.GetValue(nameof(KeyConfiguration.DataType), StringComparison.OrdinalIgnoreCase) == null)
                    obj.Add(nameof(KeyConfiguration.DataType), "dummy");
            }
            else
            {
                AddDummyDataTypeIfMissing(prop.Value);
            }
    }
}
