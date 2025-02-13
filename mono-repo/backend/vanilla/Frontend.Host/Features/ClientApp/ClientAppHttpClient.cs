using System.Net.Http.Json;

namespace Frontend.Host.Features.ClientApp;

internal sealed class ClientAppHttpClient(HttpClient httpClient)
{
    public Task<HttpResponseMessage> GetAsync(Uri path, CancellationToken cancellationToken)
    {
        return httpClient.GetAsync(path, cancellationToken);
    }

    public Task<T?> GetFromJsonAsync<T>(Uri path, CancellationToken cancellationToken)
    {
        return httpClient.GetFromJsonAsync<T>(path, cancellationToken);
    }
}
