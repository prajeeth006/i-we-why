using Bwin.DynaCon.Api.Contracts.V1;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;

/// <summary>
/// Deserializes whole set of configs from JSON model.
/// </summary>
internal interface IChangesetDeserializer
{
    IValidChangeset Deserialize(ConfigurationResponse changesetDto, VariationHierarchyResponse contextHierarchy, ConfigurationSource source);
}
