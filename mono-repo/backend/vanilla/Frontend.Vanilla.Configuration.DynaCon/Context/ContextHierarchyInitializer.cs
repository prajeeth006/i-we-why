using System;
using Frontend.Vanilla.Configuration.DynaCon.FileFallback;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Configuration.DynaCon.Context;

/// <summary>
/// Initializes shared instance of context hierarchy.
/// </summary>
internal sealed class ContextHierarchyInitializer(
    ICurrentContextHierarchyManager currentContextHierarchy,
    IContextHierarchyRestService restService,
    IFallbackFile<VariationContextHierarchy> fallbackFile,
    ILogger<ContextHierarchyInitializer> log)
    : IConfigurationInitializer
{
    public void Initialize()
    {
        var hierarchy = GetHierarchy();
        currentContextHierarchy.Set(hierarchy);
    }

    private VariationContextHierarchy GetHierarchy()
    {
        try
        {
            return restService.Get();
        }
        catch (Exception ex)
        {
            if (fallbackFile.Handler == null)
            {
                log.LogCritical(ex, "Failed fetching context hierarchy mandatory for startup from DynaCon REST service. Fallback file is disabled");

                throw;
            }

            log.LogError(ex, "Failed fetching context hierarchy mandatory for startup from DynaCon REST service. Trying fallback file");

            return GetHierarchyFromFallbackFile(fallbackFile.Handler, ex);
        }
    }

    private VariationContextHierarchy GetHierarchyFromFallbackFile(IFallbackFileHandler<VariationContextHierarchy> fallbackFileHandler, Exception serviceError)
    {
        try
        {
            return fallbackFileHandler.Read();
        }
        catch (Exception fallbackEx)
        {
            const string message = "Failed fetching context hierarchy mandatory for startup from DynaCon REST service and also fallback file.";
            var finalEx = new AggregateException(message, serviceError, fallbackEx);
            log.LogCritical(finalEx, message);

            throw finalEx;
        }
    }
}
