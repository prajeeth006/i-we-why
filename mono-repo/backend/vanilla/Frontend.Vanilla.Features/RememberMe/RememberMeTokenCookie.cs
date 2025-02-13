using System;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.RememberMe;

/// <summary>
/// Encapsulates logic related to remember-me token cookie + other support cookies.
/// All methods can be called only when HttpRequest to URL under login path!.
/// </summary>
internal interface IRememberMeTokenCookie
{
    TrimmedRequiredString? Get();
    void Set(TrimmedRequiredString value);
    void Delete();
}

internal sealed class RememberMeTokenCookie(
    ICookieHandler cookieHandler,
    IRememberMeConfiguration rememberMeConfig,
    IHttpContextAccessor httpContextAccessor,
    IClock clock)
    : IRememberMeTokenCookie
{
    public const string TokenCookieName = "rm-t";
    public const string IndicatorCookieName = "rm-i";
    public const string HistoryCookieName = "rm-h";
    public const string ExpirationDateCookieName = "rm-d";
    public const string AuthBaseRoute = "api/auth";
    public const CookieDomain TokenCookieDomain = CookieDomain.Full;
    public const string TokenCookiePath = "/" + AuthBaseRoute;
    private const string DummyCookieValue = "1";

    public TrimmedRequiredString? Get()
    {
        GuardRequestUnderLoginPath();

        // Trim b/c good enough value, cookie as external source is not fully trusted
        var value = cookieHandler.GetValue(TokenCookieName);

        return !value.IsNullOrWhiteSpace()
            ? new TrimmedRequiredString(value.Trim())
            : null;
    }

    public void Set(TrimmedRequiredString value)
    {
        GuardRequestUnderLoginPath();

        var currentTokenExpirationDate = UtcDateTime.TryParse(cookieHandler.GetValue(ExpirationDateCookieName));

        var expirationDate = currentTokenExpirationDate ?? clock.UtcNow + rememberMeConfig.Expiration;

        if (currentTokenExpirationDate == null)
        {
            cookieHandler.Set(ExpirationDateCookieName, expirationDate.ToString(), new CookieSetOptions
            {
                MaxAge = rememberMeConfig.Expiration,
            });
        }

        cookieHandler.Set(TokenCookieName, value, new CookieSetOptions
        {
            Expires = expirationDate,
            HttpOnly = true,
            Domain = TokenCookieDomain,
            Path = TokenCookiePath,
        });
        cookieHandler.Set(IndicatorCookieName, DummyCookieValue, new CookieSetOptions
        {
            Expires = expirationDate,
        });
        cookieHandler.Set(HistoryCookieName, DummyCookieValue, new CookieSetOptions
        {
            MaxAge = rememberMeConfig.Expiration.Multiply(5),
        });
    }

    public void Delete()
    {
        GuardRequestUnderLoginPath();

        cookieHandler.Delete(TokenCookieName, new CookieLocationOptions
        {
            Domain = TokenCookieDomain,
            Path = TokenCookiePath,
        });
        cookieHandler.Delete(IndicatorCookieName);
        cookieHandler.Delete(HistoryCookieName);
        cookieHandler.Delete(ExpirationDateCookieName);
    }

    private void GuardRequestUnderLoginPath()
    {
        var requestPath = httpContextAccessor.GetRequiredHttpContext().Request.GetAbsolutePath();

        if (requestPath.StartsWithSegments(TokenCookiePath, StringComparison.OrdinalIgnoreCase) != true)
            throw new InvalidOperationException($"Remember-me cookie resides at path '{TokenCookiePath}'"
                                                + $"so can be manipulated only in requests with URL under that path but the current one is '{requestPath}'.");
    }
}
