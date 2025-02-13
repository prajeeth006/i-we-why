using System;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Initialization;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Configuration.DynaCon.FileFallback;

/// <summary>
/// On startup if loading configuration from REST service fails, tries to load it from fallback file.
/// </summary>
internal sealed class FallbackChangesetLoader(
    IInitialChangesetLoader inner,
    IFallbackFile<IValidChangeset> fallbackFile,
    ILogger<FallbackChangesetLoader> log)
    : IInitialChangesetLoader
{
    private const string FallingBackError = "Configuration falling back to the one from file.";
    private const string AllFailedError = "Failed to load configuration both from service and fallback file.";

    public IConfigurationSnapshot GetConfiguration(bool maskSensitiveData = false)
    {
        try
        {
            return inner.GetConfiguration(maskSensitiveData);
        }
        catch (ConfigurationLoadException ex)
        {
            if (fallbackFile.Handler == null)
            {
                throw;
            }

            log.LogError(ex, FallingBackError);
            var changeset = GetConfigFromFallbackFile(fallbackFile.Handler, ex);
            var failedChangesets = ex.FailedChangeset != null ? new[] { ex.FailedChangeset } : Array.Empty<IChangeset>();

            return new ConfigurationSnapshot(changeset, futureChangesets: failedChangesets);
        }
    }

    private IValidChangeset GetConfigFromFallbackFile(IFallbackFileHandler<IValidChangeset> fallbackFileHandler, Exception serviceError)
    {
        try
        {
            return fallbackFileHandler.Read();
        }
        catch (Exception ex)
        {
            var fatalEx = new AggregateException(serviceError, ex); // Exception from the service should primary one
            log.LogCritical(fatalEx, AllFailedError);

            throw fatalEx;
        }
    }
}
