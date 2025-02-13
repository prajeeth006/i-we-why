using System;
using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.B_Feature;

/// <summary>
/// Drops useless values once there is a one with higher priority which applies to any context.
/// </summary>
internal sealed class ValuesOptimizationDecorator(IFeatureDeserializer inner) : IFeatureDeserializer
{
    public WithWarnings<IReadOnlyList<FeatureConfiguration>> Deserialize(
        IConfigurationInfo info,
        IReadOnlyDictionary<string, KeyConfiguration> featureDto,
        VariationHierarchyResponse contextHierarchy)
    {
        var newFeatureDto = featureDto.ToDictionary(
            d => d.Key,
            d => new KeyConfiguration(d.Value.DataType, DropAllAfterAnyIfSimpleValues(d.Value), d.Value.CriticalityLevel),
            StringComparer.OrdinalIgnoreCase);

        return inner.Deserialize(info, newFeatureDto, contextHierarchy);
    }

    private static IEnumerable<ValueConfiguration> DropAllAfterAnyIfSimpleValues(KeyConfiguration keyDto)
    {
        var needsJsonMerging = false;

        foreach (var value in keyDto.Values.OrderByDescending(v => v.Priority))
        {
            yield return value;

            needsJsonMerging = needsJsonMerging || value.Value is JObject;

            if (!needsJsonMerging && value.Context.Count == 0)
            {
                yield break;
            }
        }
    }
}
