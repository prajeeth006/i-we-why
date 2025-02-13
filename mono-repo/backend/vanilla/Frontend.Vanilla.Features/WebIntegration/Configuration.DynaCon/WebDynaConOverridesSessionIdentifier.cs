using System;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.Session;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Cookies;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;

/// <summary>
/// Stores identifier of DynaCon overrides session in dedicated cookie.
/// </summary>
internal class WebDynaConOverridesSessionIdentifier(ICookieHandler cookieHandler, IHttpContextAccessor httpContextAccessor) : IDynaConOverridesSessionIdentifier
{
    public const string CookieName = "DynaConSessionOverrides";

    private static readonly CookieSetOptions CookieOptions = new CookieSetOptions
    {
        Domain = CookieDomain.Label,
        HttpOnly = true, // Only this code should read it
    };

    public TrimmedRequiredString? Value
    {
        get
        {
            if (httpContextAccessor.HttpContext == null)
                return null;

            var id = cookieHandler.GetValue(CookieName);

            return id != null ? new TrimmedRequiredString(id) : null;
        }
    }

    public TrimmedRequiredString Create()
    {
        var id = Guid.NewGuid().ToString("N");
        cookieHandler.Set(CookieName, id, CookieOptions); // This throws if no HttpContext which we want

        return id;
    }

    public void Delete()
        // This throws if no HttpContext which we want
        => cookieHandler.Delete(CookieName, CookieOptions);
}
