using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Core.Rest;

/// <summary>
/// Records all details of REST request execution for tracing purposes.
/// </summary>
internal sealed class TracedRestClient(RestClientBase inner, ITraceRecorder traceRecorder, IHttpClientFactory httpClientFactory) : RestClientBase(httpClientFactory)
{
    public override Task<RestResponse> ExecuteAsync(ExecutionMode mode, RestRequest request)
    {
        var trace = traceRecorder.GetRecordingTrace();

        return trace != null // Make sure there is no async overhead
            ? ExecuteWithTracingAsync(mode, request, trace)
            : inner.ExecuteAsync(mode, request);
    }

    private async Task<RestResponse> ExecuteWithTracingAsync(ExecutionMode mode, RestRequest request, IRecordingTrace trace)
    {
        try
        {
            var response = await inner.ExecuteAsync(mode, request);

            RecordTrace(exception: null,
                ("response.status", response.ToString()),
                ("response.content", response.Content.DecodeToString()),
                ("response.headers", response.Headers.ToString()));

            return response;
        }
        catch (Exception ex)
        {
            RecordTrace(ex, ("response.status", "0 NetworkError"));

            throw;
        }

        void RecordTrace(Exception? exception, params (string, object?)[] responseValues)
            => trace.Record($"REST request: {request}", exception, new Dictionary<string, object?>
            {
                { "request.url", request.Url.AbsoluteUri },
                { "request.method", request.Method.ToString().ToUpper() },
                { "request.content", request.Content?.Bytes.DecodeToString() },
                { "request.headers", request.Headers.ToString() },
                { "request.timeout", request.Timeout },
                { "request.followRedirects", request.FollowRedirects },
                { "executionMode", mode.ToString() },
                responseValues,
            });
    }
}
