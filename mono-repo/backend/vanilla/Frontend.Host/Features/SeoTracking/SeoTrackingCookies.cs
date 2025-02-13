using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Cookies;

namespace Frontend.Host.Features.SeoTracking;

/// <summary>
/// Handling of cookies related to SEO tracking.
/// </summary>
internal interface ISeoTrackingCookies
{
    string? GetWmid();
    void SetWmid(string value);
    void SetLandingUrl(Uri url);
}

internal sealed class SeoTrackingCookies(ICookieHandler cookieHandler, ISeoTrackingConfiguration config) : ISeoTrackingCookies
{
    public string? GetWmid()
        => cookieHandler.GetValue(config.WmidCookieName);

    public void SetWmid(string value)
    {
        Guard.NotWhiteSpace(value, nameof(value));
        SetCookie(config.WmidCookieName, value);
    }

    public void SetLandingUrl(Uri url)
    {
        Guard.NotNull(url, nameof(url));
        Guard.AbsoluteUri(url, nameof(url));

        SetCookie(config.LandingUrlCookieName, url.AbsoluteUri);
    }

    private void SetCookie(string name, string value)
        => cookieHandler.Set(name, value, new CookieSetOptions()
        {
            MaxAge = TimeSpan.FromDays(30),
        });
}
