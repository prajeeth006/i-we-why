using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Validation.Annotations;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;

namespace Frontend.Vanilla.Configuration.DynaCon;

/// <summary>
/// Builds <see cref="DynaConEngineSettings" /> in strongly guarded way providing reasonable defaults.
/// </summary>
public sealed class DynaConEngineSettingsBuilder : IValidatableObject
{
    /// <summary>
    /// Gets or sets the host URL of DynaCon API.
    /// Default: https://api.dynacon.bwin.prod/.
    /// </summary>
    [Required, HttpHostUrl]
    public HttpUri Host { get; set; } = new HttpUri("https://api.dynacon.prod.env.works/");

    /// <summary>
    /// Gets or sets the API version used in the URL.
    /// Default: v1.
    /// </summary>
    [Required, RegularExpression(@"v\d+")]
    public string ApiVersion { get; set; } = "v1";

    /// <summary>
    /// Gets or sets the path of file with fallback changeset.
    /// It can be a pattern which is resolved to a final file for a concrete tenant (label for Vanilla web app).
    /// </summary>
    [NotEmptyNorWhiteSpace, RootedPath]
    public string? ChangesetFallbackFile { get; set; }

    /// <summary>
    /// Gets or sets the path of file with fallback changeset.
    /// It can be a pattern which is resolved to a final file for a concrete tenant (label for Vanilla web app).
    /// </summary>
    [NotEmptyNorWhiteSpace, RootedPath]
    public string? ContextHierarchyFallbackFile { get; set; }

    /// <summary>
    /// Gets or sets the path of file with fallback company network subnets.
    /// It can be a pattern which is resolved to a final file for a concrete tenant (label for Vanilla web app).
    /// </summary>
    [NotEmptyNorWhiteSpace, RootedPath]
    public string DynaconAppBootFallbackFile { get; set; } =
        OperatingSystem.IsWindows() ? @"D:\Configuration\DynaCon\DynaconAppBootFallbackFile.json" : "/configuration/DynaCon/DynaconAppBootFallbackFile.json";

    /// <summary>
    /// Gets or sets the mode of local overrides.
    /// </summary>
    [DefinedEnumValue]
    public LocalOverridesMode LocalOverridesMode { get; set; }

    /// <summary>
    /// Gets or sets the path of file with local overrides.
    /// It can be a pattern which is resolved to a final file for a concrete tenant (label for Vanilla web app).
    /// </summary>
    [NotEmptyNorWhiteSpace, RootedPath]
    public string? LocalOverridesFile { get; set; }

    /// <summary>
    /// Sets <see cref="LocalOverridesFile" /> and <see cref="LocalOverridesMode" /> at the same time.
    /// </summary>
    public void EnableLocalFileOverrides(string file)
    {
        LocalOverridesMode = LocalOverridesMode.File;
        LocalOverridesFile = file;
    }

    /// <summary>
    /// Gets or sets the interval of polling for configuration changes.
    /// </summary>
    [MinimumTimeSpan("00:00:00.1")]
    public TimeSpan? ChangesPollingInterval { get; set; }

    /// <summary>
    /// Gets or sets the startup delay during which polling request shouldn't be executed yet. Usually the app is starting up during this time hence very busy.
    /// Default: 10 seconds.
    /// </summary>
    [MinimumTimeSpan("00:00:00")]
    public TimeSpan PollingStartupDelay { get; set; } = TimeSpan.FromSeconds(10); // Vanilla web app usually takes abot 10 sec to start up

    /// <summary>
    /// Gets or sets the interval of polling for validatable changesets (e.g. waiting for approval) in order to proactively validate them.
    /// </summary>
    [MinimumTimeSpan("00:00:00.1")]
    public TimeSpan? ProactiveValidationPollingInterval { get; set; }

    /// <summary>
    /// Gets or sets the network timeout for HTTP requests to DynaCon API.
    /// Default: 10 seconds.
    /// </summary>
    [MinimumTimeSpan("00:00:01")]
    public TimeSpan NetworkTimeout { get; set; } = TimeSpan.FromSeconds(10);

    /// <summary>
    /// Gets or sets the network timeout for HTTP requests to DynaCon API to fetch validatable changesets.
    /// Default: 10 seconds.
    /// </summary>
    [MinimumTimeSpan("00:00:01")]
    public TimeSpan ValidatableChangesetsNetworkTimeout { get; set; } = TimeSpan.FromSeconds(10);

    /// <summary>
    /// Gets or sets the maximum number of past changesets stored and displayed in diagnostic report.
    /// Default: 10.
    /// </summary>
    [Minimum(0)]
    public int PastChangesetsMaxCount { get; set; } = 10;

    /// <summary>
    /// Gets or sets maximum number of past service calls stored and displayed in diagnostic report.
    /// Default: 100.
    /// </summary>
    [Minimum(1, ErrorMessage = nameof(PastServiceCallsMaxCount) + " must be at least 1"
                                                                + " because health check wouldn't be able to determine if last call was successful. Actual value: " +
                                                                ValidationAttributeBase.Placeholders.ActualValue + ".")]
    public int PastServiceCallsMaxCount { get; set; } = 100;

    /// <summary>
    /// Gets or sets maximum number of past proactively validated changesets stored and displayed in diagnostic report.
    /// Default: 10.
    /// </summary>
    [Minimum(0)]
    public int PastProactivelyValidatedChangesetsMaxCount { get; set; } = 10;

    /// <summary>
    /// Gets or sets the URL of admin web for managing the configuration.
    /// Default: https://admin.dynacon.prod.env.works/.
    /// </summary>
    [Required, HttpHostUrl]
    public HttpUri AdminWeb { get; set; } = new HttpUri("https://admin.dynacon.prod.env.works/");

    /// <summary>
    /// Indicates if feedback regarding changeset validity should be sent to DynaCon.
    /// </summary>
    public bool SendFeedback { get; set; }

    /// <summary>
    /// Gets or sets the ID of a changeset which should be loaded directly instead of current one.
    /// </summary>
    [Minimum(1)]
    public long? ExplicitChangesetId { get; set; }

    /// <summary>
    /// Gets or sets the list of parameters.
    /// </summary>
    [Required, NotEmptyCollection, UniqueItems]
    public IList<DynaConParameter> Parameters { get; set; }

    /// <summary>
    /// See <see cref="DynaConEngineSettings.AdditionalInfo" />.
    /// </summary>
    public IDictionary<TrimmedRequiredString, object> AdditionalInfo { get; } = new Dictionary<TrimmedRequiredString, object>(RequiredStringComparer.OrdinalIgnoreCase);

    /// <summary>
    /// Creates a new instance.
    /// </summary>
    public DynaConEngineSettingsBuilder(params DynaConParameter[] parameters)
        => Parameters = new List<DynaConParameter>(parameters);

    /// <summary>Builds the settings. Internally called by Vanilla.</summary>
    internal DynaConEngineSettings Build()
        => new DynaConEngineSettings(this);

    IEnumerable<ValidationResult> IValidatableObject.Validate(ValidationContext validationContext)
    {
        if (ExplicitChangesetId != null)
        {
            const string whenSuffix = " when ExplicitChangesetId is specified.";

            if (ChangesetFallbackFile != null)
                yield return new ValidationResult("ChangesetFallbackFile must be null (disabled)" + whenSuffix);

            if (ChangesPollingInterval != null)
                yield return new ValidationResult("ChangesPollingInterval must be null (disabled)" + whenSuffix);
        }

        if (LocalOverridesMode == LocalOverridesMode.File)
        {
            const string whenSuffix = " when LocalOverridesMode='File'.";

            if (LocalOverridesFile == null)
                yield return new ValidationResult("LocalOverridesFile must be specified" + whenSuffix);

            if (ChangesetFallbackFile != null)
                yield return new ValidationResult("ChangesetFallbackFile must be null (disabled)" + whenSuffix);

            if (ChangesPollingInterval != null)
                yield return new ValidationResult("ChangesPollingInterval must be null (disabled)" + whenSuffix);

            if (ProactiveValidationPollingInterval != null)
                yield return new ValidationResult("ProactiveValidationPollingInterval must be null (disabled)" + whenSuffix);

            if (SendFeedback)
                yield return new ValidationResult("SendFeedback must be false (disabled)" + whenSuffix);
        }

        if (ProactiveValidationPollingInterval != null && !SendFeedback)
            yield return new ValidationResult(
                "If ProactiveValidationPollingInterval is specified (enabled) then SendFeedback must be true (enabled) so that proactive validation can post the feedback.");

        foreach (var duplicate in Parameters.Where(p => !p.Name.EqualsIgnoreCase(DynaConParameter.ServiceName)).FindDuplicatesBy(p => p.Name))
            yield return new ValidationResult(
                $"Parameter with Name='{duplicate.Key}' is specified multiple times with Value-s: {duplicate.Select(d => $"'{d.Value}'").Join()}.");

        if (!Parameters.Any(p => p.Name.EqualsIgnoreCase(DynaConParameter.ServiceName)))
            yield return new ValidationResult($"At least one parameter with Name='{DynaConParameter.ServiceName}' must be specified to load its configuration.");

        if (ChangesetFallbackFile == null ^ ContextHierarchyFallbackFile == null)
            yield return new ValidationResult(
                "ChangesetFallbackFile and ContextHierarchyFallbackFile must be both specified (enabled) or null (disabled) at the same time.");

        if (ContextHierarchyFallbackFile != null && ContextHierarchyFallbackFile.Contains('{'))
            yield return new ValidationResult(
                $"ContextHierarchyFallbackFile can't contain any placeholders. It must be final file path but it is '{ContextHierarchyFallbackFile}'.");

        if (DynaconAppBootFallbackFile.Contains('{'))
            yield return new ValidationResult(
                $"DynaconAppBootFallbackFile can't contain any placeholders. It must be final file path but it is '{DynaconAppBootFallbackFile}'.");
    }
}
