using System;
using System.Linq;
using System.Net.Http;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Core.Rest;

/// <summary>
/// Converts <see cref="RestRequest" /> to <see cref="HttpRequestMessage" />.
/// </summary>
internal static class RestRequestConverter
{
    public static readonly ReadOnlySet<string> CalculatedHeaders =
        new[] { HttpHeaders.ContentType }.ToHashSet(StringComparer.OrdinalIgnoreCase).AsReadOnly();

    /// <summary>Right now it doesn't validate header values except of newline validation. This would be beneficial, example
    /// httpRequestMessage.Content.Headers.ContentType = new MediaTypeHeaderValue(request.Content.Formatter.ContentType);.
    /// </summary>
    public static HttpRequestMessage Convert(RestRequest request)
    {
        var httpRequestMessage = new HttpRequestMessage(new HttpMethod(request.Method.Method), request.Url);

        if (request.Content != null)
        {
            httpRequestMessage.Content = new ByteArrayContent(request.Content.Bytes);
            httpRequestMessage.Content.Headers.AddIfNoNewlines(HttpHeaders.ContentType, request.Content.Formatter.ContentType);
        }

        foreach (var header in request.Headers)
        {
            if (!CalculatedHeaders.Contains(header.Key))
            {
                httpRequestMessage.Headers.AddIfNoNewlines(header.Key, header.Value, ignoreNullValue: false);
            }
        }

        if (!request.Headers.ContainsKey(HttpHeaders.Accept))
        {
            httpRequestMessage.Headers.AddIfNoNewlines(HttpHeaders.Accept, request.Content?.Formatter.ContentType);
        }

        return httpRequestMessage;
    }
}
