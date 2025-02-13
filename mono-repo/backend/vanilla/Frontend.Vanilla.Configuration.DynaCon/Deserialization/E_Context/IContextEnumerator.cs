using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.Context;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.E_Context;

/// <summary>
/// Enumerates all possible of contexts from values in given feature DTO.
/// </summary>
internal interface IContextEnumerator
{
    IEnumerable<VariationContext> GetContexts(
        IReadOnlyDictionary<string, KeyConfiguration> featureDto,
        VariationHierarchyResponse contextHierarchy);
}
