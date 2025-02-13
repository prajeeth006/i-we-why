using System;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;
using Frontend.Vanilla.Configuration.DynaCon.RestService;

namespace Frontend.Vanilla.Configuration.DynaCon.Initialization;

/// <summary>
/// On startup loads particular changeset if explicit ID is specified in the settings.
/// </summary>
internal sealed class ExplicitChangesetLoader(
    IInitialChangesetLoader inner,
    DynaConEngineSettings settings,
    IConfigurationRestService restService,
    IChangesetDeserializer deserializer,
    IConfigurationServiceUrls urls,
    ICurrentContextHierarchy currentContextHierarchy)
    : IInitialChangesetLoader
{
    public IConfigurationSnapshot GetConfiguration(bool maskSensitiveData = false)
    {
        if (settings.ExplicitChangesetId == null)
        {
            return inner.GetConfiguration(maskSensitiveData);
        }

        try
        {
            var dto = restService.GetConfiguration(settings.ExplicitChangesetId.Value);
            var changeset = deserializer.Deserialize(dto, currentContextHierarchy.Value, ConfigurationSource.Service);

            return new ConfigurationSnapshot(changeset);
        }
        catch (Exception ex)
        {
            var url = urls.Changeset(settings.ExplicitChangesetId.Value);
            var msg = $"Failed loading explicitly configured changeset #{settings.ExplicitChangesetId} from {url}";

            throw new ConfigurationLoadException(msg, ex);
        }
    }
}
