using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.NativeApp;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="INativeApplicationDslProvider" />.
/// </summary>
internal sealed class NativeApplicationDslProvider(INativeAppService nativeAppService) : INativeApplicationDslProvider
{
    public bool IsNative()
        => nativeAppService.GetCurrentDetails().IsNative;

    public bool IsNativeApp()
        => nativeAppService.GetCurrentDetails().IsNativeApp;

    public bool IsNativeWrapper()
        => nativeAppService.GetCurrentDetails().IsNativeWrapper;

    public bool IsDownloadClient()
        => nativeAppService.GetCurrentDetails().IsDownloadClient;

    public bool IsDownloadClientApp()
        => nativeAppService.GetCurrentDetails().IsDownloadClientApp;

    public bool IsDownloadClientWrapper()
        => nativeAppService.GetCurrentDetails().IsDownloadClientWrapper;

    public bool IsTerminal()
        => nativeAppService.GetCurrentDetails().IsTerminal;

    public string GetProduct()
        => nativeAppService.GetCurrentDetails().Product;

    public string GetSubChannel()
        => nativeAppService.GetCurrentDetails().ApplicationName;

    public string GetName()
        => nativeAppService.GetCurrentDetails().ApplicationName;
}
