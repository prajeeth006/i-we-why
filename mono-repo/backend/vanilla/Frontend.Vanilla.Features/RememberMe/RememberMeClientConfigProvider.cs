using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.RememberMe;

internal sealed class RememberMeClientConfigProvider(IRememberMeConfiguration config, INativeApplicationDslProvider nativeApplicationDslProvider)
    : LambdaClientConfigProvider("vnRememberMe", () => new
    {
        IsEnabled = config.IsEnabled && (!nativeApplicationDslProvider.IsNative() || nativeApplicationDslProvider.IsNativeWrapper()),
        config.ApiHost,
        legacyTokenExtractionIframeUrl = string.Empty, // TODO can be removed safely in year 2025
        config.SkipRetryPaths,
    })
{ }
