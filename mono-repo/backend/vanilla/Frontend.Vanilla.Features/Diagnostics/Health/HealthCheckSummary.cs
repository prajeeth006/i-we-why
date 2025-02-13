#nullable disable
using System;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Features.Diagnostics.Health;

/// <summary>
/// All summary information regarding health check execution.
/// </summary>
internal sealed class HealthCheckSummary
{
    [JsonIgnore]
    public string Name { get; set; }

    public string Description { get; set; }
    public string WhatToDoIfFailed { get; set; }
    public TimeSpan ExecutionTime { get; set; }
    public bool Passed { get; set; }

    [JsonIgnore]
    public HealthCheckSeverity Severity { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public object Details { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public ConfigurationSummary Configuration { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public Uri DocumentationUri { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public object Error { get; set; }
}

internal sealed class ConfigurationSummary(string featureName, object instance)
{
    public string FeatureName { get; } = featureName;
    public object Instance { get; } = instance;
}
