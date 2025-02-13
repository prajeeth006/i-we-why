using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Diagnostics.Contracts.Configuration;

public enum CriticalityLevel
{
    /// <summary>
    /// Criticality level: None.
    /// </summary>
    None = 0,

    /// <summary>
    /// Criticality level: Security.
    /// </summary>
    Security = 1,

    /// <summary>
    /// Criticality level: Technical.
    /// </summary>
    Technical = 2,
}

public sealed class ConfigurationReportDto(
    long activeChangesetId,
    IReadOnlyDictionary<string, IReadOnlyList<FeatureConfigurationDto>> activeChangesetFeatures,
    JObject dynaConJson,
    JObject overridesJson,
    string? overridesMode,
    IReadOnlyList<long> futureChangesetIds,
    JToken changesetChanges,
    JToken errorsJson,
    JToken warningsJson,
    JToken settingsJson,
    JToken multitenancyJson,
    JToken networkTraffic,
    JToken proactiveValidation,
    JToken fileFallback,
    IReadOnlyDictionary<string, string> currentVariationContext,
    IReadOnlyList<string> dynaConServiceNames,
    JToken dotNetClasses,
    ConfigurationUrlsDto urls)
{
    public long ActiveChangesetId { get; } = activeChangesetId;
    public IReadOnlyDictionary<string, IReadOnlyList<FeatureConfigurationDto>> ActiveChangesetFeatures { get; } = activeChangesetFeatures;
    public JObject DynaConJson { get; } = dynaConJson;
    public JObject OverridesJson { get; } = overridesJson;
    public string? OverridesMode { get; } = overridesMode;
    public IReadOnlyList<long> FutureChangesetIds { get; } = futureChangesetIds;
    public JToken ChangesetChanges { get; } = changesetChanges;
    public JToken ErrorsJson { get; } = errorsJson;
    public JToken WarningsJson { get; } = warningsJson;
    public JToken SettingsJson { get; } = settingsJson;
    public JToken MultitenancyJson { get; } = multitenancyJson;
    public JToken NetworkTraffic { get; } = networkTraffic;
    public JToken ProactiveValidation { get; } = proactiveValidation;
    public JToken FileFallback { get; } = fileFallback;
    public IReadOnlyDictionary<string, string> CurrentVariationContext { get; } = currentVariationContext;
    public IReadOnlyList<string> DynaConServiceNames { get; } = dynaConServiceNames;
    public JToken DotNetClasses { get; } = dotNetClasses;
    public ConfigurationUrlsDto Urls { get; } = urls;
}

public sealed class FeatureConfigurationDto(
    JObject instanceJson,
    IReadOnlyDictionary<string, IReadOnlyList<string>> context,
    ulong priority,
    bool currentlyUsed,
    int criticalityLevel)
{
    public JObject InstanceJson { get; } = instanceJson;
    public IReadOnlyDictionary<string, IReadOnlyList<string>> Context { get; } = context;
    public ulong Priority { get; } = priority;
    public bool CurrentlyUsed { get; } = currentlyUsed;
    public int CriticalityLevel { get; } = criticalityLevel;
}

public sealed class ConfigurationUrlsDto(
    string serviceAdminPattern,
    string featureAdminPattern,
    string changesetAdminPattern,
    Uri changesetHistoryAdmin,
    Uri activeChangesetApi)
{
    public string ServiceAdminPattern { get; } = serviceAdminPattern;
    public string FeatureAdminPattern { get; } = featureAdminPattern;
    public string ChangesetAdminPattern { get; } = changesetAdminPattern;
    public Uri ChangesetHistoryAdmin { get; } = changesetHistoryAdmin;
    public Uri ActiveChangesetApi { get; } = activeChangesetApi;
}
