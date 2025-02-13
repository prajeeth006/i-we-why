using System.Net.Http.Headers;
using Frontend.Vanilla.Features.LabelResolution;
using Microsoft.AspNetCore.Http;
using HttpHeaders = Frontend.Vanilla.Core.Rest.HttpHeaders;

namespace Frontend.Host.Features.ClientApp;

internal sealed class SameSiteUrlHandler(IClientAppConfiguration config)
    : DelegatingHandler
{
    protected override Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        if (config.SameSiteForceHttp && request.RequestUri is not null)
        {
            request.RequestUri = new UriBuilder(request.RequestUri)
            {
                Scheme = "http",
                Port = 80,
            }.Uri;
        }

        return base.SendAsync(request, cancellationToken);
    }
}

internal sealed class SameSiteHttpClient
{
    private readonly HttpClient httpClient;

    public SameSiteHttpClient(HttpClient httpClient)
    {
        this.httpClient = httpClient;
        httpClient.DefaultRequestHeaders.CacheControl = new CacheControlHeaderValue
        {
            NoCache = true,
        };
    }

    public Task<string> GetStringAsync(Uri path, CancellationToken cancellationToken)
    {
        return httpClient.GetStringAsync(path, cancellationToken);
    }
}
