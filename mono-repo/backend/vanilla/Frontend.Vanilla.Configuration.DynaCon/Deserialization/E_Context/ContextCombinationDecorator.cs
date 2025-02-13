using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.E_Context;

/// <summary>
/// Creates all possible combinations of contexts returned by inner.
/// </summary>
internal sealed class ContextCombinationDecorator(IContextEnumerator inner) : IContextEnumerator
{
    public IEnumerable<VariationContext> GetContexts(IReadOnlyDictionary<string, KeyConfiguration> featureDto, VariationHierarchyResponse contextHierarchy)
    {
        var contexts = inner.GetContexts(featureDto, contextHierarchy).Distinct();
        var result = Combine(contexts.Distinct().GetEnumerator()).Distinct();

        return result;
    }

    private static IEnumerable<VariationContext> Combine(IEnumerator<VariationContext> enumerator)
    {
        if (!enumerator.MoveNext() || enumerator.Current == null)
            yield break;

        var current = enumerator.Current;

        yield return current;

        foreach (var other in Combine(enumerator))
        {
            yield return other;

            // Something combined with empty is something -> useless
            if (IsDefault(current) || IsDefault(other) || current.Equals(other))
                continue;

            // Different values of same parameter can't be combined
            if (current.Properties.Any(p => other.Properties.TryGetValue(p.Key, out var vals) && !p.Value.SequenceEqual(vals)))
                continue;

            var combinedPriority = current.Priority | other.Priority; // Each bit means presense of a context property -> use bitwise OR
            var combinedProps = ToPairs(current).Union(ToPairs(other));

            yield return new VariationContext(combinedPriority, combinedProps);
        }
    }

    private static IEnumerable<(TrimmedRequiredString, TrimmedRequiredString)> ToPairs(VariationContext context)
        => context.Properties.SelectMany(p => p.Value.Select(s => (p.Key, s)));

    private static bool IsDefault(VariationContext context)
        => context.Properties.Count == 0 && context.Priority == 0;
}
