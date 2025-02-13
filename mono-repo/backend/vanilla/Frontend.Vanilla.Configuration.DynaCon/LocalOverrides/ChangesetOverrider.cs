using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;

/// <summary>
/// Overrides a changeset using given overrides.
/// </summary>
internal interface IChangesetOverrider
{
    IValidChangeset Override(IValidChangeset changeset, JObject overridesJson);
}

internal sealed class ChangesetOverrider(IChangesetDeserializer deserializer, IOverridesJsonMerger jsonMerger) : IChangesetOverrider
{
    private static readonly JsonSerializer JsonSerializer = JsonSerializer.Create();

    public IValidChangeset Override(IValidChangeset changeset, JObject overridesJson)
    {
        var json = JObject.FromObject(changeset.Dto);
        jsonMerger.Merge(json, overridesJson);

        var dto = JsonSerializer.Deserialize<ConfigurationResponse>(new JTokenReader(json));

        return deserializer.Deserialize(dto!, changeset.ContextHierarchy, ConfigurationSource.LocalOverrides);
    }
}
