using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.RestMocks.Infrastructure;

internal sealed class MockedRestClient(IRestClient inner, RestResponseMocker mocker, IHttpClientFactory httpClientFactory) : RestClientBase(httpClientFactory)
{
    public override async Task<RestResponse> ExecuteAsync(ExecutionMode mode, RestRequest request)
    {
        var mocked = mocker.TryMockResponse(request);

        return mocked ?? await inner.ExecuteAsync(mode, request);
    }
}
