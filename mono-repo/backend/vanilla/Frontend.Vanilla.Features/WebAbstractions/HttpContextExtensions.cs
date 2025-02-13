using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.WebAbstractions;

/// <summary>
/// Provides extensions on HttpContext.
/// </summary>
public static class HttpContextExtensions
{
    /// <summary>
    /// Writes to HttpResponse.
    /// </summary>
    /// <param name="httpContext"></param>
    /// <param name="contentType"></param>
    /// <param name="text"></param>
    /// <returns>A <see cref="Task"/> representing the result of the asynchronous operation.</returns>
    public static async Task WriteResponseAsync(this HttpContext httpContext, string contentType, string text)
    {
        var bytes = text.EncodeToBytes();
        httpContext.Response.ContentType = contentType;
        httpContext.Response.ContentLength = bytes.Length;
        await httpContext.Response.Body.WriteAsync(bytes, httpContext.RequestAborted);
    }

    /// <summary>
    /// Gets route value.
    /// </summary>
    public static string? GetRouteValue(this HttpContext httpContext, string key)
        => (string?)httpContext.Request.RouteValues[key];

    /// <summary>Gets or adds scoped value items. Thread safe. Uses scoped <see cref="IRequestScopedValuesProvider"/>.</summary>
    public static TValue GetOrAddScopedValue<TKey, TValue>(this HttpContext context, TKey key, Func<TKey, TValue?> valueFactory)
        where TKey : notnull
        where TValue : notnull
    {
        return context.RequestServices.GetRequiredService<IRequestScopedValuesProvider>()
            .GetOrAddValue(key, valueFactory);
    }
}
