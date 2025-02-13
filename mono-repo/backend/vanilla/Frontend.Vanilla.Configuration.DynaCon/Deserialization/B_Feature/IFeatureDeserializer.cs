using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.B_Feature;

/// <summary>
/// Deserializes all instances for a single feature from given DTO returned from DynaCon.
/// </summary>
internal interface IFeatureDeserializer
{
    WithWarnings<IReadOnlyList<FeatureConfiguration>> Deserialize(
        IConfigurationInfo info,
        IReadOnlyDictionary<string, KeyConfiguration> featureDto,
        VariationHierarchyResponse contextHierarchy);
}
