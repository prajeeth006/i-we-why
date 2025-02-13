using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Core.Rest;

/// <summary>
/// Converts <see cref="HttpResponseMessage" /> to <see cref="RestResponse" />.
/// </summary>
internal static class RestResponseConverter
{
    public static async Task<RestResponse> ConvertAsync(HttpResponseMessage httpResponse, RestRequest request, TimeSpan executionDuration)
    {
        var content = await httpResponse.Content.ReadAsByteArrayAsync();
        var result = new RestResponse(request)
        {
            StatusCode = httpResponse.StatusCode,
            StatusDescription = httpResponse.ReasonPhrase ?? string.Empty,
            Content = content,
            ExecutionDuration = executionDuration,
        };

        foreach (var header in httpResponse.Headers)
        {
            result.Headers.Add(header.Key, header.Value.ToArray());
        }
        foreach (var contentHeader in httpResponse.Content.Headers)
        {
            result.Headers.Add(contentHeader.Key, contentHeader.Value.ToArray());
        }

        return result;
    }
}
