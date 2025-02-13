using System;
using System.Linq;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.EntryWeb.TopLevelDomainCookies;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.WebIntegration;

internal sealed class AspNetCoreCookieHandler(
    ICookieConfiguration config,
    IHttpContextAccessor httpContextAccessor,
    Func<ITopLevelDomainCookiesConfiguration> topLevelDomainCookiesConfiguration,
    Func<ICookiePartitionedStateProvider> cookiePartitionedStateProvider)
    : ICookieHandler
{
    private readonly Lazy<ITopLevelDomainCookiesConfiguration> topLevelDomainCookiesConfiguration = topLevelDomainCookiesConfiguration.ToLazy();
    private readonly Lazy<ICookiePartitionedStateProvider> cookiePartitionedStateProvider = cookiePartitionedStateProvider.ToLazy();

    public string? GetValue(string name)
    {
        var httpContext = httpContextAccessor.GetRequiredHttpContext();
        var responseCookie = httpContext.Response.GetTypedHeaders().SetCookie.FirstOrDefault(x => x.Name.Equals(name));

        // On Aspnet core request and response cookies are kept separate so in first request cookie will not be available in Request Cookies right after writing it.
        var value = httpContext.Request.Cookies[name] ?? responseCookie?.Value.Value;

        return value;
    }

    public void Set(string name, string value, CookieSetOptions? options)
    {
        if (topLevelDomainCookiesConfiguration.Value.SetCookieDomain.Cookies.Contains(name))
        {
            options ??= new CookieSetOptions();

            options.Domain = CookieDomain.Special;
            options.SpecialDomainValue = topLevelDomainCookiesConfiguration.Value.SetCookieDomain.Domain;
        }

        var sameSite = options?.SameSite ?? default;
        var httpOptions = CommonConfigure(options, new CookieOptions
        {
            MaxAge = options?.MaxAge,
            Expires = options?.Expires?.Value,
            HttpOnly = options?.HttpOnly ?? false,
            SameSite = (SameSiteMode)(sameSite != SameSiteFlag.None ? sameSite : config.DefaultSameSiteMode),
        });
        var httpContext = httpContextAccessor.GetRequiredHttpContext();
        httpContext.Response.Cookies.Append(name, value, httpOptions);
    }

    public void Delete(string name, CookieLocationOptions? options)
    {
        var httpOptions = CommonConfigure(options, new CookieOptions());
        var httpContext = httpContextAccessor.GetRequiredHttpContext();
        httpContext.Response.Cookies.Delete(name, httpOptions);
    }

    private CookieOptions CommonConfigure(CookieLocationOptions? options, CookieOptions httpOptions)
    {
        httpOptions.Domain = (options?.Domain ?? default) switch
        {
            CookieDomain.Special => options?.SpecialDomainValue,
            CookieDomain.Label => config.CurrentLabelDomain.Value,
            CookieDomain.Full => null,
            _ => throw (options?.Domain ?? default).GetInvalidException(),
        };
        httpOptions.Path = options?.Path ?? "/";
        httpOptions.Secure = config.Secure;
        cookiePartitionedStateProvider.Value.SetPartitionedState(httpOptions);

        return httpOptions;
    }
}
