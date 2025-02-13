using System;

namespace Frontend.Vanilla.Features.Cookies;

internal interface ICookieSameSiteProvider
{
    SameSiteFlag DefaultSameSiteMode { get; }
    SameSiteFlag AuthCookieSameSiteMode { get; }
}

internal sealed class CookieSameSiteProvider(IDynaConCookieConfiguration dynaConConfig) : ICookieSameSiteProvider
{
    public SameSiteFlag DefaultSameSiteMode => (SameSiteFlag)Enum.Parse(typeof(SameSiteFlag), dynaConConfig.DefaultSameSiteMode);

    public SameSiteFlag AuthCookieSameSiteMode => (SameSiteFlag)Enum.Parse(typeof(SameSiteFlag), dynaConConfig.AuthCookieSameSiteMode);
}
