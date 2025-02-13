using System;
using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.E_Context;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.B_Feature;

/// <summary>
/// Cleans up input DTO from DynaCon - validates it, filters values, returns appropriate warnings or throws.
/// </summary>
internal sealed class InputCleanUpDecorator : IFeatureDeserializer
{
    private static readonly StringComparer Comparer = StringComparer.OrdinalIgnoreCase;
    private readonly IFeatureDeserializer featureDeserializer;
    private readonly IContextHierarchyExpander contextExpander;
    private readonly StaticVariationContext staticContext;
    private readonly HashSet<string> dynamicContextKeys;

    public InputCleanUpDecorator(
        IFeatureDeserializer featureDeserializer,
        IContextHierarchyExpander contextExpander,
        StaticVariationContext staticContext,
        IDynamicVariationContextResolver dynamicContextResolver)
    {
        this.featureDeserializer = featureDeserializer;
        this.contextExpander = contextExpander;
        this.staticContext = staticContext;
        dynamicContextKeys = dynamicContextResolver.ProviderNames.Select(n => n.ToString()).ToHashSet(Comparer);
    }

    public WithWarnings<IReadOnlyList<FeatureConfiguration>> Deserialize(
        IConfigurationInfo info,
        IReadOnlyDictionary<string, KeyConfiguration> featureDto,
        VariationHierarchyResponse contextHierarchy)
    {
        // Prepare clean input & output
        var inputWarnings = new List<TrimmedRequiredString>();
        var newDto = new Dictionary<string, KeyConfiguration>(StringComparer.OrdinalIgnoreCase);

        // Calculate context according to current hierarchy
        var childrenOfStaticContext = staticContext.ToDictionary(
            c => c.Key.Value,
            c => contextExpander.GetChildren(contextHierarchy, c.Key, c.Value)
                .Select(s => s.ToString())
                .ToHashSet(Comparer),
            Comparer);

        var expandedStaticContext = staticContext.ToDictionary(
            c => c.Key.Value,
            c => contextExpander.GetParents(contextHierarchy, c.Key, c.Value)
                .Select(s => s.ToString())
                .Append(c.Value.Value)
                .Concat(childrenOfStaticContext[c.Key])
                .ToHashSet(Comparer),
            Comparer);

        // Go through all keys & values, filter out unsupported or fail immediately
        foreach (var pair in featureDto)
        {
            if (string.IsNullOrWhiteSpace(pair.Key))
            {
                throw new Exception("There can't be empty nor white-space keys but the feature contains such one.");
            }

            var validValues = new List<ValueConfiguration>(pair.Value.Values.Count);

            foreach (var value in pair.Value.Values)
            {
                var valueResult = SanitizeValue(value);

                if (valueResult.Warning != null)
                {
                    inputWarnings.Add($"Key '{pair.Key}' contains a value with {valueResult.Warning}. Therefore the value is skipped.");
                }

                if (valueResult.ValidValue != null)
                {
                    validValues.Add(valueResult.ValidValue);
                }
            }

            if (validValues.All(v => v.Context.Count > 0))
            {
                throw new Exception(
                    $"There must be at least one default value (applies for any or app-static context) for key '{pair.Key}' but there are: {ToJson(pair.Value)}");
            }

            newDto.Add(pair.Key,
                new KeyConfiguration(pair.Value.DataType,
                    pair.Value is { CriticalityLevel: 1, DataType: "json" } ? new List<ValueConfiguration> { new ValueConfiguration(new JArray()) } : validValues,
                    pair.Value.CriticalityLevel));
        }

        var (configs, deserializationWarnings) = featureDeserializer.Deserialize(info, newDto, contextHierarchy);

        return configs.WithWarnings(deserializationWarnings.Concat(inputWarnings));

        // Extracted code for value validation & cleanup
        (ValueConfiguration? ValidValue, string? Warning) SanitizeValue(ValueConfiguration value)
        {
            if (value.ValidFrom != null || value.ValidTo != null)
            {
                return (null, "unsupported ValidFrom/ValidTo");
            }

            // E.g. {environment=beta} but full static for this app is environment=[test,qa,qa1,qa2]
            var conflictingProps = value.Context
                .Where(c => expandedStaticContext.TryGetValue(c.Key, out var values) && !values.Contains(c.Value))
                .Select(c => c.Key)
                .ToList();

            if (conflictingProps.Count > 0)
            {
                return (null,
                    $"properties {ToJson(conflictingProps)} in its context {ToJson(value.Context)} conflicting with expanded static context of this app {ToJson(expandedStaticContext)}");
            }

            // E.g. 'galaxy' but static is [label,product,environment...] and dynamic [nativeApp,country,currency...]
            var unsupportedProps = value.Context.Keys
                .Where(k => !staticContext.ContainsKey(k) && !dynamicContextKeys.Contains(k))
                .ToList();

            if (unsupportedProps.Count > 0)
            {
                return (null,
                    $"unsupported properties {ToJson(unsupportedProps)} in its context {ToJson(value.Context)}. Supported ones: {ToJson(dynamicContextKeys)}");
            }

            // Too specific context with child values that will never be matched b/c ours is static e.g. qa2 but we are qa -> just filter, no warning b/c according to DynaCon contract
            if (value.Context.Any(c => childrenOfStaticContext.TryGetValue(c.Key, out var values) && values.Contains(c.Value)))
            {
                return (null, null);
            }

            // Static context would mess up rest of deserialization and resolution -> remove it but keep priority
            var cleanedContext = value.Context
                .Where(c => !staticContext.ContainsKey(c.Key))
                .ToDictionary();

            return (new ValueConfiguration(value.Value, cleanedContext, value.Priority), null);
        }
    }

    private static string ToJson(object obj)
        => JsonConvert.SerializeObject(obj);
}
