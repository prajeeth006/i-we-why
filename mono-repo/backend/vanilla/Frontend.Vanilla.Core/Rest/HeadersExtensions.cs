using System;
using DotNetHttpHeaders = System.Net.Http.Headers.HttpHeaders;

namespace Frontend.Vanilla.Core.Rest;

internal static class HeadersExtensions
{
    public static void AddIfNoNewlines(this DotNetHttpHeaders headers, string name, string? value, bool ignoreNullValue = true)
    {
        if (value is null && ignoreNullValue)
        {
            return;
        }

        if (value is not null && ContainsNewLine(value))
        {
            throw new FormatException("Failed to forward request headers to device atlas, no newlines validation failed.");
        }

        // header value doesn't contain any newlines - now it's safe to add them without validation
        // we can't use .Add method because it validates header formats according to RFC
        // there are many UserAgent headers out there not conforming to this format.
        headers.TryAddWithoutValidation(name, value);
    }

    private static bool ContainsNewLine(string value, int startIndex = 0) =>
        value.AsSpan(startIndex).ContainsAny('\r', '\n');
}
