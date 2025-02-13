using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Validation;

namespace Frontend.Vanilla.Configuration.DynaCon;

/// <summary>
/// Settings of DynaCon configuration engine.
/// Must be always valid also in unit test in order to test only meaningful scenarios
/// therefore they must be always create using <see cref="DynaConEngineSettingsBuilder" />.
/// </summary>
internal sealed class DynaConEngineSettings
{
    public HttpUri Host { get; }
    public string ApiVersion { get; }
    public RootedPath? ContextHierarchyFallbackFile { get; }
    public LocalOverridesMode LocalOverridesMode { get; }
    public TimeSpan? ChangesPollingInterval { get; }
    public TimeSpan PollingStartupDelay { get; }
    public TimeSpan? ProactiveValidationPollingInterval { get; }
    public TimeSpan ValidatableChangesetsNetworkTimeout { get; }
    public TimeSpan NetworkTimeout { get; }
    public int PastChangesetsMaxCount { get; }
    public int PastServiceCallsMaxCount { get; }
    public int PastProactivelyValidatedChangesetsMaxCount { get; }
    public HttpUri AdminWeb { get; }
    public bool SendFeedback { get; }
    public long? ExplicitChangesetId { get; }
    public IReadOnlyDictionary<TrimmedRequiredString, object> AdditionalInfo { get; }
    public TenantSettings TenantBlueprint { get; }
    public RootedPath DynaconAppBootFallbackFile { get; }

    internal DynaConEngineSettings(DynaConEngineSettingsBuilder builder)
    {
        var errors = ObjectValidator.GetErrors(builder);

        if (errors.Count > 0)
            throw new Exception("Settings of DynaCon configuration engine are invalid: " + errors.Select(e => e.ErrorMessage).ToDebugString());

        Host = builder.Host;
        ApiVersion = builder.ApiVersion;
        LocalOverridesMode = builder.LocalOverridesMode;
        ChangesPollingInterval = builder.ChangesPollingInterval;
        PollingStartupDelay = builder.PollingStartupDelay;
        ProactiveValidationPollingInterval = builder.ProactiveValidationPollingInterval;
        NetworkTimeout = builder.NetworkTimeout;
        ValidatableChangesetsNetworkTimeout = builder.ValidatableChangesetsNetworkTimeout;
        PastChangesetsMaxCount = builder.PastChangesetsMaxCount;
        PastServiceCallsMaxCount = builder.PastServiceCallsMaxCount;
        PastProactivelyValidatedChangesetsMaxCount = builder.PastProactivelyValidatedChangesetsMaxCount;
        AdminWeb = builder.AdminWeb;
        SendFeedback = builder.SendFeedback;
        ExplicitChangesetId = builder.ExplicitChangesetId;
        AdditionalInfo = builder.AdditionalInfo.ToDictionary();
        ContextHierarchyFallbackFile = builder.ContextHierarchyFallbackFile.IfNotNull(f => new RootedPath(f));
        DynaconAppBootFallbackFile = new RootedPath(builder.DynaconAppBootFallbackFile);

        var changesetFallbackFile = builder.ChangesetFallbackFile.IfNotNull(f => new RootedPath(f));
        var localOverridesFile = builder.LocalOverridesMode == LocalOverridesMode.File ? builder.LocalOverridesFile.IfNotNull(f => new RootedPath(f)) : null;
        TenantBlueprint = new TenantSettings("(TenantBlueprint)", changesetFallbackFile, localOverridesFile, builder.Parameters);
    }
}

/// <summary>Defines mode of local overrides.</summary>
public enum LocalOverridesMode
{
    /// <summary>Overrides are disabled.</summary>
    Disabled,

    /// <summary>Overrides come from local file defined in <see cref="DynaConEngineSettingsBuilder.LocalOverridesFile" />.</summary>
    File,

    /// <summary>Overrides are stored in the user's session (static field for non-web apps).</summary>
    Session,
}
