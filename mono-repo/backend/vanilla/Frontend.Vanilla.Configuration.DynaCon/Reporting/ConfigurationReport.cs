using System;
using System.Collections.Generic;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Configuration.DynaCon.Polling.ProactiveValidation;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.Reporting;

/// <summary>
/// Defines format of configuration status data. It is displayed in <c>/health/config</c>.
/// </summary>
internal sealed class ConfigurationReport
{
    public IDictionary<TrimmedRequiredString, object> CriticalErrors { get; } = new Dictionary<TrimmedRequiredString, object>(RequiredStringComparer.OrdinalIgnoreCase);
    public IDictionary<TrimmedRequiredString, object> Warnings { get; } = new Dictionary<TrimmedRequiredString, object>(RequiredStringComparer.OrdinalIgnoreCase);
    public ChangesetReport? Configuration { get; set; }
    public IReadOnlyDictionary<TrimmedRequiredString, TrimmedRequiredString>? VariationContextForThisRequest { get; set; }
    public SettingsReport? Settings { get; set; }
    public object? ChangesetFallbackFile { get; set; }
    public object? ContextHierarchyFallbackFile { get; set; }
    public LocalOverridesReport? LocalOverrides { get; set; }
    public object? PollingForChanges { get; set; }
    public object? ProactiveValidation { get; set; }
    public IReadOnlyList<IConfigurationInfo>? FeaturesMetadata { get; set; }
    public IReadOnlyDictionary<TrimmedRequiredString, TenantReport>? Multitenancy { get; set; }
    public IReadOnlyList<RestServiceCallInfo>? ServiceCalls { get; set; }
    public IConfigurationServiceUrls? Urls { get; set; }
    public IConfigurationSnapshot? Snapshot { get; set; }
}

internal sealed class ChangesetReport
{
    public IValidChangeset? Active { get; set; }
    public IValidChangeset? Overridden { get; set; }
    public IReadOnlyList<IChangeset>? Future { get; set; }

    public IReadOnlyList<PastChangesetInfo>? Past { get; set; }
}

internal sealed class FallbackFileReport
{
    public RootedPath? Path { get; set; }
    public object? Content { get; set; }
    public FileProperties? Properties { get; set; }
}

internal class LocalOverridesReport
{
    public LocalOverridesMode Mode { get; set; }
    public JObject? OverridesJson { get; set; }
}

internal sealed class LocalFileOverridesReport : LocalOverridesReport
{
    public RootedPath? Path { get; set; }
    public FileProperties? Properties { get; set; }
    public string? Content { get; set; }
}

internal sealed class PollingForChangesReport
{
    public UtcDateTime NextPollTime { get; set; }
    public long FromChangesetId { get; set; }
    public HttpUri? Url { get; set; }
}

internal sealed class ProactiveValidationReport
{
    public IReadOnlyList<ValidatedChangesetInfo>? PastValidations { get; set; }
    public UtcDateTime NextPollTime { get; set; }
    public HttpUri? Url { get; set; }
}

internal sealed class SettingsReport
{
    public DynaConEngineSettings? Engine { get; set; }
    public TenantSettings? CurrentTenant { get; set; }
}

internal sealed class TenantReport
{
    public UtcDateTime StartTime { get; set; }
    public UtcDateTime LastAccessTime { get; set; }
    public long TotalAccessCount { get; set; }
    public long AverageAccessCountPerMinute => (long)Math.Round(TotalAccessCount / (LastAccessTime - StartTime).TotalMinutes);
}
