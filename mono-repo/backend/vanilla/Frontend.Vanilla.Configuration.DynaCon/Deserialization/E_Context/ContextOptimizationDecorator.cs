using System;
using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.E_Context;

/// <summary>
/// Execludes unnecessary contexts hence configs because there is no chance they will be used because other contexts with higher priority will be matched.
/// For example if defined context values are: label = [bwin.es, party.com]; nativeApp = [sports, unknown]
/// and actual contexts are:
/// - priority = 10, label = bwin.es, nativeApp = sports
/// - priority = 10, label = bwin.es, nativeApp = unknown
/// - priority = 8, label = bwin.es -> useless b/c one of previous values will always match first.
/// </summary>
internal sealed class ContextOptimizationDecorator(IContextEnumerator inner, StaticVariationContext staticVarContext) : IContextEnumerator
{
    public IEnumerable<VariationContext> GetContexts(IReadOnlyDictionary<string, KeyConfiguration> featureDto, VariationHierarchyResponse contextHierarchy)
    {
        var dynamicHiearchy = contextHierarchy.Hierarchy.Where(h => !staticVarContext.ContainsKey(h.Key));
        var contextStatesToCover = GetAllPossibleContextStates(dynamicHiearchy.GetEnumerator()).ToList();
        var contexts = inner.GetContexts(featureDto, contextHierarchy);

        foreach (var context in contexts.OrderByDescending(c => c.Priority))
        {
            contextStatesToCover.RemoveAll(c => IsContextCoveringState(context, c));

            yield return context;

            if (contextStatesToCover.Count == 0)
                yield break;
        }

        Guard.Assert(false,
            "Uncovered context states: " +
            EnumerableExtensions.Join(contextStatesToCover.Select(c => "(" + EnumerableExtensions.Join(c.Select(p => p.Key + "=" + p.Value) + ")")),
                Environment.NewLine));
    }

    private static bool IsContextCoveringState(VariationContext context, IReadOnlyDictionary<string, string> contextState)
        => context.Properties.All(p => contextState.TryGetValue(p.Key, out var val) && p.Value.Contains(val));

    private static IEnumerable<IReadOnlyDictionary<string, string>> GetAllPossibleContextStates(
        IEnumerator<KeyValuePair<string, IReadOnlyDictionary<string, string>>> contextEnumerator)
    {
        if (!contextEnumerator.MoveNext())
        {
            yield return new Dictionary<string, string>();

            yield break;
        }

        var contextProperty = contextEnumerator.Current.Key;
        var contextValues = contextEnumerator.Current.Value.Keys.ToList();
        var subContexts = GetAllPossibleContextStates(contextEnumerator);

        foreach (var subContext in subContexts)
        foreach (var contextValue in contextValues)
        {
            var resultContext = Enumerable.ToDictionary(subContext, StringComparer.OrdinalIgnoreCase);
            resultContext.Add(contextProperty, contextValue);

            yield return resultContext;
        }
    }
}
