using LaunchDarkly.Sdk.Server;
using System.Collections.Generic;

namespace Frontend.Vanilla.Features.LaunchDarkly;

internal interface ILaunchDarklyConfiguration
{
    string ClientId { get; }
    LDOptions ClientConfigurationOptions { get; }
}

internal sealed class LaunchDarklyConfiguration(string clientId, LDOptions clientResponseCacheControl) : ILaunchDarklyConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.LaunchDarkly";

    public string ClientId { get; set; } = clientId;
    public LDOptions ClientConfigurationOptions { get; set; } = clientResponseCacheControl;
}

internal class LDOptions(string? hash, bool? fetchGoals, bool? disableSyncEventPost, string? baseUrl, string? eventsUrl, string? streamUrl, bool? streaming, bool? useReport, bool? sendLDHeaders, bool? evaluationReasons, bool? sendEvents, bool? allAttributesPrivate, string?[] privateAttributes, bool? sendEventsOnlyForVariation, int? eventCapacity, int? flushInterval, int? streamReconnectDelay, bool? diagnosticOptOut, int? diagnosticRecordingInterval, string? wrapperName, string? wrapperVersion)
{
    public string? Hash { get; set; } = hash;
    public bool? FetchGoals { get; set; } = fetchGoals;
    public bool? DisableSyncEventPost { get; set; } = disableSyncEventPost;
    public string? BaseUrl { get; set; } = baseUrl;
    public string? EventsUrl { get; set; } = eventsUrl;
    public string? StreamUrl { get; set; } = streamUrl;
    public bool? Streaming { get; set; } = streaming;
    public bool? UseReport { get; set; } = useReport;
    public bool? SendLDHeaders { get; set; } = sendLDHeaders;
    public bool? EvaluationReasons { get; set; } = evaluationReasons;
    public bool? SendEvents { get; set; } = sendEvents;
    public bool? AllAttributesPrivate { get; set; } = allAttributesPrivate;
    public string?[] PrivateAttributes { get; set; } = privateAttributes;
    public bool? SendEventsOnlyForVariation { get; set; } = sendEventsOnlyForVariation;
    public int? EventCapacity { get; set; } = eventCapacity;
    public int? FlushInterval { get; set; } = flushInterval;
    public int? StreamReconnectDelay { get; set; } = streamReconnectDelay;
    public bool? DiagnosticOptOut { get; set; } = diagnosticOptOut;
    public int? DiagnosticRecordingInterval { get; set; } = diagnosticRecordingInterval;
    public string? WrapperName { get; set; } = wrapperName;
    public string? WrapperVersion { get; set; } = wrapperVersion;
}
