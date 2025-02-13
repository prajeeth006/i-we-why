using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Validation.Annotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.NativeApp;

internal interface INativeAppConfiguration
{
    IReadOnlyDictionary<string, NativeAppConfigurationRecord> Apps { get; }
    string LinksContentRoot { get; }
    IDslExpression<bool> EnableAppsFlyerFilterValue { get; }
    bool EnableWrapperEmulator { get; }
    bool PartnerSessionIdSupported { get; }
    int AppSettingsTimeout { get; }
    string Schema { get; }
    bool SendOpenLoginDialogEvent { get; }
    bool EnableCcbDebug { get; }
    IReadOnlyList<string> DisabledEvents { get; }
    bool EnableCcbTracing { get; }
    string TracingBlacklistPattern { get; }
    bool SendPostLoginOnGoToNative { get; }
    bool HtcmdSchemeEnabled { get; }
}

internal sealed class NativeAppConfigurationRecord(string productId, string mode)
{
    public string ProductId { get; set; } = productId;
    public string Mode { get; set; } = mode;
}

internal sealed class NativeAppConfiguration(
    string linksContentRoot,
    IDslExpression<bool> enableAppsFlyerFilterValue,
    bool enableWrapperEmulator,
    bool partnerSessionIdSupported,
    int appSettingsTimeout,
    string schema,
    bool sendOpenLoginDialogEvent,
    IReadOnlyDictionary<string, NativeAppConfigurationRecord> apps,
    bool enableCcbDebug,
    IReadOnlyList<string> disabledEvents,
    bool enableCcbTracing,
    string tracingBlacklistPattern,
    bool sendPostLoginOnGoToNative,
    bool htcmdSchemeEnabled)
    : INativeAppConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.NativeApp";

    [Required, RequiredKeys, RequiredValues]
    public IReadOnlyDictionary<string, NativeAppConfigurationRecord> Apps { get; } = apps.ToDictionary(StringComparer.OrdinalIgnoreCase);

    [RequiredString]
    public string LinksContentRoot { get; } = linksContentRoot;

    public IDslExpression<bool> EnableAppsFlyerFilterValue { get; } = enableAppsFlyerFilterValue;
    public bool EnableWrapperEmulator { get; } = enableWrapperEmulator;
    public bool PartnerSessionIdSupported { get; } = partnerSessionIdSupported;
    public int AppSettingsTimeout { get; } = appSettingsTimeout;
    public string Schema { get; } = schema;
    public bool SendOpenLoginDialogEvent { get; } = sendOpenLoginDialogEvent;
    public bool EnableCcbDebug { get; } = enableCcbDebug;
    public IReadOnlyList<string> DisabledEvents { get; } = disabledEvents;
    public bool EnableCcbTracing { get; } = enableCcbTracing;
    public string TracingBlacklistPattern { get; } = tracingBlacklistPattern;
    public bool SendPostLoginOnGoToNative { get; } = sendPostLoginOnGoToNative;
    public bool HtcmdSchemeEnabled { get; } = htcmdSchemeEnabled;
}
