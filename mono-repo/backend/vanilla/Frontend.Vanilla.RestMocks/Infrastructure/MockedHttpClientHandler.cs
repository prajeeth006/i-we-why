using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.RestMocks.Infrastructure;

internal sealed class MockedHttpClientHandler(RestResponseMocker mocker) : HttpClientHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage httpRequest, CancellationToken cancellationToken)
    {
        var restRequest = new RestRequest(new HttpUri(httpRequest.RequestUri));

        httpRequest.Headers.Each(pair => pair.Value.Each(value => restRequest.Headers.Add(pair.Key, value)));

        var restResponse = mocker.TryMockResponse(restRequest);

        if (restResponse != null)
        {
            await Task.Delay(TimeSpan.FromMilliseconds(50), cancellationToken); // Simulates real environment and also causes real async execution

            return new HttpResponseMessage
            {
                StatusCode = restResponse.StatusCode,
                Content = new ByteArrayContent(restResponse.Content)
                {
                    Headers = { ContentType = new MediaTypeHeaderValue("application/json") },
                },
            };
        }

        return await base.SendAsync(httpRequest, cancellationToken);
    }
}
