using System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Cookies;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Features.Login;

/// <summary>
/// Handler for super cookie.
/// </summary>
internal interface ISuperCookie
{
    /// <summary>
    /// Gets the value of the cookie.
    /// </summary>
    /// <returns>The value of the cookie.</returns>
    string? GetValue();

    /// <summary>
    /// Sets the value of the cookie.
    /// </summary>
    /// <param name="value">The value to be set.</param>
    void SetValue(string value);
}

internal sealed class SuperCookie : ISuperCookie
{
    private readonly ICookieHandler cookieHandler;
    private readonly ILoginSettingsConfiguration loginSettingsConfiguration;

    public SuperCookie([NotNull] ICookieHandler cookieHandler, ILoginSettingsConfiguration loginSettingsConfiguration)
    {
        Guard.NotNull(cookieHandler, nameof(cookieHandler));
        this.cookieHandler = cookieHandler;
        this.loginSettingsConfiguration = loginSettingsConfiguration;
    }

    public string? GetValue()
        => cookieHandler.GetValue(CookieConstants.SuperCookie);

    public void SetValue(string value)
    {
        double maxAge = 365 * 10;
        if (loginSettingsConfiguration.SuperCookieMaxAge != 0) { maxAge = (double)loginSettingsConfiguration!.SuperCookieMaxAge; }
        cookieHandler.Set(
                CookieConstants.SuperCookie,
                value,
                new CookieSetOptions()
                {
                    MaxAge = TimeSpan.FromDays(maxAge),
                });
    }
}
