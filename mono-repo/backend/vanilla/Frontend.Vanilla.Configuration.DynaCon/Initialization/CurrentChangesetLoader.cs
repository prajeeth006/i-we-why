using System;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Configuration.DynaCon.Initialization;

/// <summary>
/// Loads the configuration from REST service on startup.
/// </summary>
internal sealed class CurrentChangesetLoader(
    IConfigurationRestService restService,
    IChangesetDeserializer deserializer,
    IConfigurationServiceUrls urls,
    ICurrentContextHierarchy currentContextHierarchy,
    ILogger<CurrentChangesetLoader> log)
    : IInitialChangesetLoader
{
    public IConfigurationSnapshot GetConfiguration(bool maskSensitiveData = false)
    {
        try
        {
            var dto = restService.GetCurrentConfiguration(maskSensitiveData);
            var changeset = deserializer.Deserialize(dto, currentContextHierarchy.Value, ConfigurationSource.Service);

            return new ConfigurationSnapshot(changeset);
        }
        catch (Exception ex)
        {
            var message = $"Failed loading current configuration fetched from: {urls.CurrentChangeset}";
            var fatalError = new ConfigurationLoadException(message, ex);
            log.LogCritical(fatalError, "Failed loading current configuration fetched from: {UrlsCurrentChangeset}", urls.CurrentChangeset);

            throw fatalError;
        }
    }
}
