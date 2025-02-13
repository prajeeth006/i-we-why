using Frontend.Vanilla.Core.Reflection;
using Serilog.Core;
using Serilog.Events;

namespace Frontend.Vanilla.Features.Logging.Enrichers;

/// <summary>
/// Adds version to log entries b/c bug fixes and code differs between versions and this helps to identify it quickly.
/// </summary>
internal sealed class VersionsLogEnricher : ILogEventEnricher
{
    private readonly string version;
    public const string VersionPropertyName = $"{LogEventProperties.EnrichedPrefix}version.VanillaFramework";

    /// <summary>
    /// Adds vanilla version to log entries b/c bug fixes and code differs between versions and this helps to identify it quickly.
    /// </summary>
    public VersionsLogEnricher(VanillaVersion vanillaVersion)
    {
        version = vanillaVersion.ToString();
    }

    public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
    {
        logEvent.SetProperty(VersionPropertyName, version);
    }
}
