using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.NativeApp;

internal sealed class NativeAppClientConfigProvider(INativeAppService nativeAppService, INativeAppConfiguration config) : LambdaClientConfigProvider("vnNativeApp",
    async (ct) =>
    {
        var details = nativeAppService.GetCurrentDetails();

        return new
        {
            details.ApplicationName,
            details.Product,
            details.NativeMode,
            details.IsNative,
            details.IsNativeApp,
            details.IsNativeWrapper,
            details.IsDownloadClient,
            details.IsDownloadClientApp,
            details.IsDownloadClientWrapper,
            details.IsTerminal,
            EnableAppsFlyer = await config.EnableAppsFlyerFilterValue.EvaluateAsync(ct),
            config.EnableWrapperEmulator,
            config.AppSettingsTimeout,
            config.PartnerSessionIdSupported,
            config.SendOpenLoginDialogEvent,
            EnableCCBDebug = config.EnableCcbDebug,
            EnableCCBTracing = config.EnableCcbTracing,
            config.DisabledEvents,
            config.TracingBlacklistPattern,
            config.SendPostLoginOnGoToNative,
            config.HtcmdSchemeEnabled,
        };
    })
{ }
