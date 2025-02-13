using Frontend.Vanilla.Features.Cookies;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Authentication;

/// <summary>
/// Dynamically sets cookie domain to the one corresponding to current label from <see cref="ICookieConfiguration" />.
/// </summary>
internal sealed class CurrentLabelDomainCookieManager(ICookieManager inner, ICookieConfiguration cookieConfig) : ICookieManager
{
    public void AppendResponseCookie(HttpContext context, string key, string? value, CookieOptions options)
    {
        options.Domain = cookieConfig.CurrentLabelDomain;
        inner.AppendResponseCookie(context, key, value, options);
    }

    public void DeleteCookie(HttpContext context, string key, CookieOptions options)
    {
        options.Domain = cookieConfig.CurrentLabelDomain;
        inner.DeleteCookie(context, key, options);
    }

    public string? GetRequestCookie(HttpContext context, string key)
        => inner.GetRequestCookie(context, key);
}
