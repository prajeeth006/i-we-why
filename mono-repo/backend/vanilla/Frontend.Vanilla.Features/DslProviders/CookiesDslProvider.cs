using System;
using System.Linq;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.DslProviders.Time;
using Frontend.Vanilla.Features.SuspiciousRequest;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="ICookiesDslProvider" /> for ASP.NET 4 apps.
/// </summary>
internal sealed class CookiesDslProvider(
    ICookieHandler cookieHandler,
    ICookieConfiguration config,
    IHttpContextAccessor httpContextAccessor,
    IDslTimeConverter dslTimeConverter,
    ISuspiciousRequestConfiguration suspiciousRequestConfiguration,
    IDynaConCookieConfiguration dynaConCookieConfiguration)
    : ICookiesDslProvider
{
    public string LabelDomain
        => config.CurrentLabelDomain;

    public string FullDomain
        => httpContextAccessor.GetRequiredHttpContext().Request.Host.Host;

    public string? Get(string name)
    {
        var cookieValue = cookieHandler.GetValue(name);

        return dynaConCookieConfiguration.EncodeValueInCookieDsl.Contains(name, StringComparer.OrdinalIgnoreCase)
            ? Uri.EscapeDataString(cookieValue ?? string.Empty)
            : cookieValue;
    }

    public void SetSession(string name, string value)
        => SetCookie(name, value);

    public void SetPersistent(string name, string value, decimal expiration)
    {
        var options = new CookieSetOptions();
        SetPersistentExpiration(options, expiration);
        SetCookie(name, value, options);
    }

    public void Delete(string name)
        => cookieHandler.Delete(name);

    public void Set(string name, string value, decimal expiration, bool httpOnly, string domain, string path)
    {
        var options = new CookieSetOptions { Path = path, HttpOnly = httpOnly };

        if (domain.EqualsIgnoreCase(LabelDomain))
            options.Domain = CookieDomain.Label;
        else if (domain.EqualsIgnoreCase(FullDomain))
            options.Domain = CookieDomain.Full;
        else
            throw new Exception(
                $"Cookie domain can be set only to label domain '{LabelDomain}' or full domain '{FullDomain}'"
                + $" but it's '{domain}' which browser would discard as unrelated to current request URL.");

        switch (expiration)
        {
            case var e when e < 0:
                cookieHandler.Delete(name, options);

                break;

            case 0:
                SetCookie(name, value, options);

                break;

            case var e when e > 0:
                SetPersistentExpiration(options, expiration);
                SetCookie(name, value, options);

                break;
        }
    }

    public const decimal AbsoluteExpirationBoundary = 946684800; // 2000-01-01; same constant is in Angular service

    private void SetCookie(string name, string value, CookieSetOptions? options = null)
    {
        var rule = suspiciousRequestConfiguration.CookieStringRules
            .FirstOrDefault(r => r.Value.Regex.IsMatch(value)).Value;

        if (rule != null)
        {
            throw new Exception(rule.Description);
        }

        cookieHandler.Set(name, value, options);
    }

    private void SetPersistentExpiration(CookieSetOptions options, decimal expiration)
    {
        if (expiration <= 0)
            throw new Exception(
                $"Expiration must be a positive number but it's {expiration}. If you want to delete the cookie or set session expiration then use corresponding function.");

        // So that consumers can specify both relative Time.Days(10) or absolute DateTime.Date(2025, 8, 6)
        if (expiration > AbsoluteExpirationBoundary)
            options.Expires = new UtcDateTime(dslTimeConverter.FromDslToTime(expiration));
        else
            options.MaxAge = dslTimeConverter.FromDslToTimeSpan(expiration);
    }
}
