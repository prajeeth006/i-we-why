using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.D_InstanceJson;

/// <summary>
/// Removes duplicates not needed because of other entries with equal JSON and more generic context.
/// </summary>
internal sealed class InstanceJsonOptimizationDecorator(IInstanceJsonResolver inner) : IInstanceJsonResolver
{
    public IEnumerable<(JObject instanceJson, VariationContext context)> Resolve(IReadOnlyDictionary<string, KeyConfiguration> featureDto,
        VariationHierarchyResponse contextHierarchy)
    {
        var items = inner.Resolve(featureDto, contextHierarchy).ToList();

        foreach (var item in items)
        {
            var moreGeneric = items
                .Where(x => IsMoreGenericThan(x.context, item.context))
                .OrderByDescending(x => x.context.Priority)
                .FirstOrDefault();

            // If next more generic item has same value -> this is not needed
            if (moreGeneric.Equals(default) || !JToken.DeepEquals(item.instanceJson, moreGeneric.instanceJson))
                yield return item;
        }
    }

    private static bool IsMoreGenericThan(VariationContext first, VariationContext second)
        => first.Priority < second.Priority
           // issue: default context: Any, priority=0, valueInDynacon=1; native context: nativeApp=poker, priority=100000, valueInDynacon=1; headerProduct context: headerproduct=promo, priority=1000, valueInDynacon=2;
           // without the below check, it will filter native context, and when current context is nativeApp=poker and headerproduct=promo, it will set valueInDynacon as 2, instead of 1.
           && first.Properties.Any()
           // e.g. environment in first [qa2, qa, test] must be superset of second [qa, qa2]
           && first.Properties.All(p => second.Properties.TryGetValue(p.Key, out var vals) && p.Value.IsSupersetOf(vals));
}
