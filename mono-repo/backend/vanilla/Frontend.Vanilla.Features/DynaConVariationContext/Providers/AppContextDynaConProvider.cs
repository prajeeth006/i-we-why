using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.DynaConVariationContext.Providers;

/// <summary>
/// Provides app specific context data for config variation context.
/// </summary>
internal sealed class AppContextDynaConProvider(IHttpContextAccessor httpContextAccessor) : IWebDynaConVariationContextProvider
{
    public TrimmedRequiredString Name { get; } = "AppContext";
    public TrimmedRequiredString DefaultValue { get; } = "default";

    public string GetCurrentRawValue()
    {
        var headers = httpContextAccessor.HttpContext?.Request.Headers;
        var xAppContextValue = headers?[HttpHeaders.XAppContext].ToString();

        if (!xAppContextValue.IsNullOrEmpty())
            return xAppContextValue;

        var secFetchDestValue = headers?[HttpHeaders.SecFetchDest].ToString();
        if (!secFetchDestValue.IsNullOrEmpty() && secFetchDestValue.EqualsIgnoreCase("iframe"))
            return secFetchDestValue;

        return DefaultValue;
    }
}
