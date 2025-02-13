using System;
using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.E_Context;

/// <summary>
/// Expands variation context according to given hierarchy by enumerating children or parents for given context property.
/// </summary>
internal interface IContextHierarchyExpander
{
    IEnumerable<TrimmedRequiredString> GetChildren(VariationHierarchyResponse contextHierarchy, TrimmedRequiredString property, TrimmedRequiredString value);
    IEnumerable<TrimmedRequiredString> GetParents(VariationHierarchyResponse contextHierarchy, TrimmedRequiredString property, TrimmedRequiredString value);
}

internal sealed class ContextHierarchyExpander : IContextHierarchyExpander
{
    public IEnumerable<TrimmedRequiredString> GetChildren(VariationHierarchyResponse contextHierarchy, TrimmedRequiredString property, TrimmedRequiredString value)
        => contextHierarchy.GetChildren(property, value);

    public IEnumerable<TrimmedRequiredString> GetParents(VariationHierarchyResponse contextHierarchy, TrimmedRequiredString property, TrimmedRequiredString value)
        => contextHierarchy.GetParents(property, value);
}

internal static class ContextHierarchyExpanderExtensions
{
    public static IEnumerable<TrimmedRequiredString> GetChildren(
        this VariationHierarchyResponse contextHierarchy,
        TrimmedRequiredString property,
        TrimmedRequiredString value)
    {
        var propertyHierarchy = GetPropertyHierarchy(contextHierarchy, property);

        return GetChildren(value);

        IEnumerable<TrimmedRequiredString> GetChildren(string current)
        {
            foreach (var relation in propertyHierarchy) // Hierarchy is [child -> parent], we want all children
                if (current.Equals(relation.Value, StringComparison.OrdinalIgnoreCase))
                {
                    yield return relation.Key;

                    foreach (var child in GetChildren(relation.Key))
                        yield return child;
                }
        }
    }

    public static IEnumerable<TrimmedRequiredString> GetParents(
        this VariationHierarchyResponse contextHierarchy,
        TrimmedRequiredString property,
        TrimmedRequiredString value)
    {
        var propertyHierarchy = GetPropertyHierarchy(contextHierarchy, property);
        string? current = value;

        while (propertyHierarchy.TryGetValue(current, out current) && current != null)
            yield return current;
    }

    private static IReadOnlyDictionary<string, string> GetPropertyHierarchy(this VariationHierarchyResponse contextHierarchy, TrimmedRequiredString property)
        => contextHierarchy.Hierarchy.GetValue(property) ?? throw new Exception($"Missing variation context hierarchy for '{property}'.");
}
