using Frontend.Vanilla.Features.Cookies;

namespace Frontend.Vanilla.Features.NativeApp;

/// <summary>
/// A service that determines if current request comes from native app and can resolve
/// information about the app and product.
/// </summary>
public interface INativeAppService
{
    /// <summary>
    /// Resolves native app details about current request.
    /// </summary>
    NativeAppDetails GetCurrentDetails();
}

internal sealed class NativeAppService(INativeAppConfiguration config, ICookieHandler cookieHandler) : INativeAppService
{
    public NativeAppDetails GetCurrentDetails()
    {
        var value = cookieHandler.GetValue(NativeAppConstants.CookieName);

        return value != null && config.Apps.TryGetValue(value, out var record)
            ? new NativeAppDetails(value, record.ProductId, record.Mode)
            : NativeAppDetails.Unknown;
    }
}
