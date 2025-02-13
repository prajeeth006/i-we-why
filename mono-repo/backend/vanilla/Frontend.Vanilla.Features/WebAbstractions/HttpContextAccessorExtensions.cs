using System;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Diagnostics;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.WebAbstractions;

/// <summary>Extensions for <see cref="IHttpContextAccessor" />.</summary>
public static class HttpContextAccessorExtensions
{
    /// <summary>Gets current <see cref="HttpContext" />. If not available then a comprehensive exception is thrown.</summary>
    public static HttpContext GetRequiredHttpContext(this IHttpContextAccessor accessor)
        => accessor.HttpContext ?? throw GetException();

    internal static Exception GetException() => new NoHttpContextException(
        "There is no HttpContext.Current but calling code requires it."
        + " Make sure that HttpContext is properly propagated through async operations and particular code is not executed on background thread/task."
        + " Called from: " + CallerInfo.Get());

    /// <summary>Gets or adds scoped value items. Thread safe. Uses scoped <see cref="IRequestScopedValuesProvider"/>.</summary>
    public static TValue GetOrAddScopedValue<TKey, TValue>(this IHttpContextAccessor accessor, TKey key, Func<TKey, TValue?> valueFactory)
        where TKey : notnull
        where TValue : notnull
    {
        return accessor.GetRequiredHttpContext().GetOrAddScopedValue(key, valueFactory);
    }
}

internal sealed class NoHttpContextException(string message) : InvalidOperationException(message) { }
