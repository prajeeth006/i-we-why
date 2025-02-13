using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.E_Context;

/// <summary>
/// Main implementation of <see cref="IContextEnumerator" />.
/// </summary>
internal sealed class DefaultContextEnumerator(IContextHierarchyExpander hierarchyExpander) : IContextEnumerator
{
    public IEnumerable<VariationContext> GetContexts(IReadOnlyDictionary<string, KeyConfiguration> featureDto, VariationHierarchyResponse contextHierarchy)
        => featureDto.Values
            .SelectMany(k => k.Values)
            .Select(v => new VariationContext(v.Priority, ExpandContext(v.Context, contextHierarchy)))
            .Distinct();

    private IEnumerable<(TrimmedRequiredString, TrimmedRequiredString)> ExpandContext(IReadOnlyDictionary<string, string> context,
        VariationHierarchyResponse contextHierarchy)
    {
        foreach (var prop in context)
        {
            yield return (prop.Key, prop.Value);

            foreach (var child in hierarchyExpander.GetChildren(contextHierarchy, prop.Key, prop.Value))
                yield return (prop.Key, child);
        }
    }
}
