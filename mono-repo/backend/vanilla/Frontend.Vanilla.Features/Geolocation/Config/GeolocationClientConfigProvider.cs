using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Geolocation.Config;

internal sealed class GeolocationClientConfigProvider(IGeolocationConfiguration config) : LambdaClientConfigProvider("vnGeolocation", () => new
{
    config.WatchOptions,
    MinimumUpdateIntervalMilliseconds = config.MinimumUpdateInterval.TotalMilliseconds,
    CookieExpirationMilliseconds = config.CookieExpiration.TotalMilliseconds,
    config.UseBrowserGeolocation,
    config.WatchBrowserPositionOnAppStart,
    config.ClientApiUrl,
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
