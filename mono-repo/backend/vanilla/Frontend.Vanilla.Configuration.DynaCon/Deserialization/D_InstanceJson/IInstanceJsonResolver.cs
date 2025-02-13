using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.D_InstanceJson;

/// <summary>
/// Resolves all relevant variation contexts with JSON of a corresponding configuration instance.
/// </summary>
internal interface IInstanceJsonResolver
{
    IEnumerable<(JObject instanceJson, VariationContext context)> Resolve(
        IReadOnlyDictionary<string, KeyConfiguration> featureDto,
        VariationHierarchyResponse contextHierarchy);
}
