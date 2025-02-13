using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.D_InstanceJson;

/// <summary>
/// Replaces ${dynacon:contextProperty} placeholders in configuration JSON. It may require multiplication of configs for each value.
/// </summary>
internal sealed class PlaceholderReplacingDecorator(IInstanceJsonResolver inner, StaticVariationContext staticVarContext) : IInstanceJsonResolver
{
    public IEnumerable<(JObject instanceJson, VariationContext context)> Resolve(IReadOnlyDictionary<string, KeyConfiguration> featureDto,
        VariationHierarchyResponse contextHierarchy)
    {
        var items = inner.Resolve(featureDto, contextHierarchy);
        var result = new List<(JObject instanceJson, VariationContext context)>();
        var errors = new List<InstanceDeserializationException>();

        foreach (var item in items)
            try
            {
                var placeholders = ExtractPlaceholders(item.instanceJson).Distinct<TrimmedRequiredString>(RequiredStringComparer.OrdinalIgnoreCase);
                var wip = new[] { item }.ToList();

                foreach (var placeholder in placeholders)
                    wip = wip.SelectMany(r => ReplacePlaceholder(r.instanceJson, placeholder, r.context, contextHierarchy)).ToList();

                result.AddRange(wip);
            }
            catch (Exception ex)
            {
                errors.Add(new InstanceDeserializationException(item.context, ex));
            }

        return errors.Count == 0
            ? result
            : throw new AggregateException(errors);
    }

    private IEnumerable<(JObject InstanceJson, VariationContext Context)> ReplacePlaceholder(
        JObject instanceJson,
        TrimmedRequiredString placeholder,
        VariationContext context,
        VariationHierarchyResponse contextHierarchy)
    {
        if (staticVarContext.TryGetValue(placeholder, out var staticValue))
        {
            // Just replace the static value, it will never change nor context will
            var newJson = ReplacePlaceholder(instanceJson, placeholder, staticValue);

            return new[] { (newJson, context) };
        }

        if (context.Properties.TryGetValue(placeholder, out var contextValues))
            return ReplacePlaceholderForEachValue(instanceJson, placeholder, contextValues, context);

        if (contextHierarchy.Hierarchy.TryGetValue(placeholder, out var hierarchy))
            return ReplacePlaceholderForEachValue(instanceJson, placeholder, hierarchy.Keys.Select(k => (TrimmedRequiredString)k), context);

        throw new Exception(
            $"Unsupported (unknown) variation context property used in a placeholder '{Prefix}{placeholder}{Suffix}'."
            + $" Available static properties: {staticVarContext.Keys.Dump()} and dynamic properties: {contextHierarchy.Hierarchy.Keys.Dump()}.");
    }

    private static IEnumerable<(JObject instanceJson, VariationContext context)> ReplacePlaceholderForEachValue(
        JObject instanceJson,
        TrimmedRequiredString placeholder,
        IEnumerable<TrimmedRequiredString> values,
        VariationContext context)
        => values.Select(
            value => // Multiply to context-specific configs for each value
            {
                var newJson = ReplacePlaceholder(instanceJson, placeholder, value);

                // Priority should be same b/c it comes from same source value
                var props = Enumerable.ToDictionary(context.Properties, RequiredStringComparer.OrdinalIgnoreCase);
                props[placeholder] = ListExtensions.AsReadOnly(EnumerableExtensions.NullToEmpty(new[] { value }).ToHashSet());
                var newCtx = new VariationContext(context.Priority, props.SelectMany(p => p.Value.Select(v => (p.Key, v))));

                return (newJson, newCtx);
            });

    private static JToken ReplacePlaceholder(JToken token, TrimmedRequiredString placeholder, TrimmedRequiredString replacement)
    {
        return token switch
        {
            JValue val when val.Value != null && (val.Type == JTokenType.String || val.Type == JTokenType.Uri) =>
                ReplacePlaceholder(val.Value.ToString()!, placeholder, replacement),
            JObject obj => ReplacePlaceholder(obj, placeholder, replacement),
            JArray array => ReplacePlaceholder(array, placeholder, replacement),
            _ => token,
        };
    }

    private static JObject ReplacePlaceholder(JObject obj, TrimmedRequiredString placeholder, TrimmedRequiredString replacement)
    {
        var newObj = new JObject();

        foreach (var prop in obj.Properties())
        {
            var newName = ReplacePlaceholder(prop.Name, placeholder, replacement);
            newObj[newName] = ReplacePlaceholder(prop.Value, placeholder, replacement);
        }

        return newObj;
    }

    private static JArray ReplacePlaceholder(JArray array, TrimmedRequiredString placeholder, TrimmedRequiredString replacement)
    {
        var newArray = new JArray();
        foreach (var item in array)
            newArray.Add(ReplacePlaceholder(item, placeholder, replacement));

        return newArray;
    }

    private static string ReplacePlaceholder(string value, TrimmedRequiredString placeholder, TrimmedRequiredString replacement)
    {
        var pattern = Regex.Escape(Prefix + placeholder + Suffix);

        return Regex.Replace(value, pattern, replacement, RegexOptions.IgnoreCase);
    }

    private const string Prefix = "${dynacon:";
    private const string Suffix = "}";

    private static IEnumerable<TrimmedRequiredString> ExtractPlaceholders(JToken token)
    {
        return token switch
        {
            JValue val when val.Value != null && (val.Type == JTokenType.String || val.Type == JTokenType.Uri) => ExtractPlaceholders(val.Value.ToString()!),
            JObject obj => obj.Properties().SelectMany(p => ExtractPlaceholders(p.Name).Concat(ExtractPlaceholders(p.Value))),
            JArray array => array.SelectMany(ExtractPlaceholders),
            _ => Array.Empty<TrimmedRequiredString>(),
        };
    }

    private static IEnumerable<TrimmedRequiredString> ExtractPlaceholders(string str)
    {
        var prefixIndex = 0;

        while ((prefixIndex = str.IndexOf(Prefix, prefixIndex, StringComparison.OrdinalIgnoreCase)) >= 0)
        {
            var suffixIndex = str.IndexOf(Suffix, prefixIndex + Prefix.Length, StringComparison.OrdinalIgnoreCase);

            if (suffixIndex < 0)
                throw new Exception($"Unclosed (missing closing '{Suffix}') placeholder from position {prefixIndex} with text: {str.Substring(prefixIndex)}");

            var result = str.Substring(prefixIndex + Prefix.Length, suffixIndex - prefixIndex - Prefix.Length);
            prefixIndex = suffixIndex + Suffix.Length;

            yield return TrimmedRequiredString.IsValid(result)
                ? result
                : throw new Exception(
                    $"Variation context property name inside a placeholder must be a trimmed non-empty string e.g. '{Prefix}FooBar{Suffix}' but there is '{Prefix}{result}{Suffix}'.");
        }
    }
}
