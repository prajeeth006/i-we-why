#nullable disable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Validation.Annotations;
using Frontend.Vanilla.Features.EntryWeb.DataLayer.TagManagers;

namespace Frontend.Vanilla.Features.EntryWeb.DataLayer;

/// <summary>
/// The configuration model used for tracking.
/// </summary>
internal interface ITrackingConfiguration
{
    /// <summary>
    /// <value>True</value> if the A/B testing is enabled, else <value>false</value>.
    /// </summary>
    bool AbTestingIsEnabled { get; }

    /// <summary>
    /// The A/B testing script source.
    /// </summary>
    string AbTestingScriptSource { get; }

    /// <summary>
    /// Gets the property for enabling Google Tag Manager tracking.
    /// </summary>
    bool IsGoogleTagManagerEnabled { get; }

    /// <summary>
    /// Gets the Google Tag Manager Container id.
    /// </summary>
    string GoogleTagManagerContainerId { get; }

    /// <summary>
    /// Gets the name of the Data layer. By convention, the 'dataLayer' value should be used but others are acceptable as well.
    /// </summary>
    /// <seealso href="https://developers.google.com/tag-manager/devguide#renaming"/>
    string DataLayerName { get; }

    /// <summary>
    /// Gets the list of domains to apply cross domain tracking for Google Analytics 3 or 4 from navigation service.
    /// </summary>
    string CrossDomainRegExG4 { get; }

    /// <summary>
    /// Gets the list of query strings that must be excluded from tracking.
    /// </summary>
    IReadOnlyList<string> NotTrackedQueryStrings { get; }

    /// <summary>
    /// Gets the timeout used to wait for the callback called by a tag manager after an event was pushed.
    /// </summary>
    TimeSpan EventCallbackTimeout { get; }

    /// <summary>
    /// Gets the timeout used to delay updating of the data layer. Should be less than EventCallbackTimeout.
    /// </summary>
    TimeSpan DataLayerUpdateTimeout { get; }

    /// <summary>
    /// Gets the timeout for page view data providers.
    /// </summary>
    int PageViewDataProviderTimeout { get; }

    /// <summary>
    /// Tag manager Scripts will be injected client side if supported by the <see cref="ITagManager"/>.
    /// </summary>
    bool UseClientInjection { get; }

    /// <summary>
    /// List of tag manager names to be excluded from client side injection
    /// so that consumers can implement custom loading behavior.
    /// </summary>
    IReadOnlyList<string> ClientInjectionExcludes { get; }

    bool EnableLogging { get; }
    bool EnableOmitting { get; }

    int DeviceConcurrency { get; }
    int DeviceMemory { get; }
    int BenchmarkThreshold { get; }
    int TrackingDelay { get; }

    bool DeviceBlockEnabled { get; }
    bool SchedulerEnabled { get; }
    bool OmitAll { get; }
    int OmitPercentage { get; }
    string[] Blocklist { get; }
    string[] Allowlist { get; }
}

internal sealed class TrackingConfiguration : ITrackingConfiguration, IValidatableObject
{
    public const string FeatureName = "VanillaFramework.Web.Tracking";
    public string CrossDomainRegExG4 { get; set; }
    public bool AbTestingIsEnabled { get; set; }
    public string AbTestingScriptSource { get; set; }
    public bool IsGoogleTagManagerEnabled { get; set; }
    public string GoogleTagManagerContainerId { get; set; }
    public string DataLayerName { get; set; }

    [Required, RequiredItems, UniqueItems(StringComparison.OrdinalIgnoreCase)]
    public IReadOnlyList<string> NotTrackedQueryStrings { get; set; }

    public TimeSpan EventCallbackTimeout { get; set; }
    public TimeSpan DataLayerUpdateTimeout { get; set; }
    public int PageViewDataProviderTimeout { get; set; }
    public bool UseClientInjection { get; set; }
    public IReadOnlyList<string> ClientInjectionExcludes { get; set; }
    public bool EnableLogging { get; set; }
    public bool EnableOmitting { get; set; }
    public bool SchedulerEnabled { get; set; }
    public bool DeviceBlockEnabled { get; set; }
    public int DeviceConcurrency { get; set; }
    public int DeviceMemory { get; set; }
    public int BenchmarkThreshold { get; set; }
    public int TrackingDelay { get; set; } = 500;
    public bool OmitAll { get; set; }
    public int OmitPercentage { get; set; }
    public string[] Blocklist { get; set; } = Array.Empty<string>();
    public string[] Allowlist { get; set; } = Array.Empty<string>();

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (IsGoogleTagManagerEnabled)
        {
            if (string.IsNullOrWhiteSpace(GoogleTagManagerContainerId))
                yield return new ValidationResult(
                    $"If {nameof(IsGoogleTagManagerEnabled)}=true then {nameof(GoogleTagManagerContainerId)} has to be configured");

            if (string.IsNullOrWhiteSpace(DataLayerName))
                yield return new ValidationResult(
                    $"If {nameof(IsGoogleTagManagerEnabled)}=true then {nameof(DataLayerName)} has to be configured. By convention, the value 'dataLayer' should be used but others are acceptable as well.");
        }
    }
}
