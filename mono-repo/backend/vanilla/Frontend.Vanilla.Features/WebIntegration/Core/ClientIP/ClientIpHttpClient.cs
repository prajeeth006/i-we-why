using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Features.WebIntegration.Core.ClientIP;

internal sealed class ClientIpHttpClient
{
    private readonly HttpClient httpClient;

    public ClientIpHttpClient(HttpClient httpClient)
    {
        this.httpClient = httpClient;
        this.httpClient.Timeout = TimeSpan.FromSeconds(3);
    }

    public Task<string> GetStringAsync(Uri path, CancellationToken cancellationToken)
    {
        return httpClient.GetStringAsync(path, cancellationToken: cancellationToken);
    }
}
