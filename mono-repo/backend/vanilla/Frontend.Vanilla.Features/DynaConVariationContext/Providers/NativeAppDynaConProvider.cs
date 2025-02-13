using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.NativeApp;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.DynaConVariationContext.Providers;

/// <summary>
/// Provides native app name from cookie/query for config variation context.
/// </summary>
internal sealed class NativeAppDynaConProvider(ICookieHandler cookieHandlerAdapter, IHttpContextAccessor httpContextAccessor) : IWebDynaConVariationContextProvider
{
    public TrimmedRequiredString Name { get; } = "NativeApp";
    public TrimmedRequiredString DefaultValue { get; } = NativeAppConstants.Unknown;

    public string GetCurrentRawValue()
    {
        var nativeAppQueryValue = httpContextAccessor.HttpContext?.Request.Query.GetValue(NativeAppConstants.QueryParameter).ToString();

        if (nativeAppQueryValue != null && !string.IsNullOrEmpty(nativeAppQueryValue))
            return nativeAppQueryValue;

        return cookieHandlerAdapter.GetValue(NativeAppConstants.CookieName) ?? DefaultValue;
    }
}
