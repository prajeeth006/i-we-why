using System;
using Frontend.Vanilla.Features.Cookies;

namespace Frontend.Vanilla.Features.HtmlInjection;

internal interface IHtmlInjectionControlOverride
{
    bool IsDisabled(HtmlInjectionKind kind);
}

internal sealed class HtmlInjectionControlOverride(ICookieHandler cookieHandlerAdapter) : IHtmlInjectionControlOverride
{
    public const string CookieName = "dhi";

    public bool IsDisabled(HtmlInjectionKind kind)
    {
        var rawValue = cookieHandlerAdapter.GetValue(CookieName);

        return Enum.TryParse(rawValue, true, out HtmlInjectionKind value)
               && value.HasFlag(kind);
    }
}
