using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.E_Context;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.D_InstanceJson;

/// <summary>
/// Main implementation of <see cref="IInstanceJsonResolver" />.
/// </summary>
internal sealed class DefaultInstanceJsonResolver(IContextEnumerator combiner, IInstanceJsonBuilder jsonBuilder) : IInstanceJsonResolver
{
    public IEnumerable<(JObject instanceJson, VariationContext context)> Resolve(IReadOnlyDictionary<string, KeyConfiguration> featureDto,
        VariationHierarchyResponse contextHierarchy)
    {
        var contexts = combiner.GetContexts(featureDto, contextHierarchy);

        foreach (var context in contexts)
        {
            var json = jsonBuilder.BuildForContext(featureDto, context, contextHierarchy);

            yield return (json, context);
        }
    }
}
