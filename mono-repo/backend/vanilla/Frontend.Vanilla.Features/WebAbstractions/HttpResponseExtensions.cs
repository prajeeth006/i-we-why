using System;
using Frontend.Vanilla.Core.Rest;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;

namespace Frontend.Vanilla.Features.WebAbstractions;

/// <summary>NET Core HttpContext utility methods.</summary>
public static class HttpResponseExtensions
{
    /// <summary>Disables Response Cache.</summary>
    public static void DisableCache(this HttpResponse httpResponse)
    {
        httpResponse.GetTypedHeaders().CacheControl = new CacheControlHeaderValue { NoCache = true, NoStore = true, MustRevalidate = true };
        httpResponse.GetTypedHeaders().Expires = new DateTimeOffset(DateTime.UtcNow);
    }

    /// <summary>
    /// Redirects.
    /// </summary>
    public static void Redirect(this HttpResponse httpResponse, string location, object source, bool permanent = false)
    {
        httpResponse.Headers[HttpHeaders.XRedirectSource] = source.ToString();
        httpResponse.Redirect(location, permanent);
    }
}
