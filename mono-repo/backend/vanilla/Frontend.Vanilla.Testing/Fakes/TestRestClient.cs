#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Testing.Fakes;

internal sealed class TestRestClient(IHttpClientFactory httpClientFactory) : RestClientBase(httpClientFactory)
{
    public IList<Func<RestRequest, RestResponse?>> Setups { get; } = new List<Func<RestRequest, RestResponse?>>();
    public IList<ExecutedRestRequestInfo> Executed { get; } = new List<ExecutedRestRequestInfo>();

    public void Setup(string urlSubstr = "", HttpMethod? method = null, HttpStatusCode responseCode = HttpStatusCode.OK, string responseContent = "")
        => Setups.Add(req => req.Method == (method ?? HttpMethod.Get) && req.Url.AbsoluteUri.Contains(urlSubstr, StringComparison.OrdinalIgnoreCase)
            ? new RestResponse(req) { StatusCode = responseCode, Content = (responseContent ?? string.Empty).EncodeToBytes() }
            : null);

    public override async Task<RestResponse> ExecuteAsync(ExecutionMode mode, RestRequest request)
    {
        Executed.Add(new ExecutedRestRequestInfo(mode, request));

        if (mode.AsyncCancellationToken != null)
            await Task.Yield();

        var response = Setups.Select(s => s(request)).LastOrDefault(r => r != null);

        return response ?? throw new RestNetworkException($"No mock set up for request {request} therefore throwing an error.");
    }
}

internal sealed class ExecutedRestRequestInfo(ExecutionMode mode, RestRequest request)
{
    public ExecutionMode Mode { get; } = mode;
    public RestRequest Request { get; } = request;
}
