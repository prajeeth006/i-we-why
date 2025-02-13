using System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.WebAbstractions;

/// <summary>Useful extensions on <see cref="HttpRequest"/>.</summary>
public static class HttpRequestExtensions
{
    /// <summary>Gets full url.</summary>
    public static HttpUri GetHostUrl(this HttpRequest request)
        => new HttpUri(request.Scheme + "://" + request.Host);

    /// <summary>Gets full url.</summary>
    public static HttpUri GetFullUrl(this HttpRequest request)
        => new HttpUri(request.Scheme + "://" + request.Host + request.PathBase + request.Path + request.QueryString);

    /// <summary>Gets base url.</summary>
    public static HttpUri GetAppBaseUrl(this HttpRequest request)
        => new HttpUri(request.Scheme + "://" + request.Host + request.PathBase);

    /// <summary>Gets absolute path.</summary>
    public static PathString GetAbsolutePath(this HttpRequest request)
        => request.PathBase + request.Path;

    /// <summary>Gets required query param value.</summary>
    public static string GetRequired(this IQueryCollection query, string key)
        => query[key].ToString().WhiteSpaceToNull()
           ?? throw new Exception($"Missing required query parameter '{key}'.");
}
