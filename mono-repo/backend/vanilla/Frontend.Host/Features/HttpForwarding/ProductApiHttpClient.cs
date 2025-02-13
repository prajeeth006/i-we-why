using System.Net.Http.Json;
using System.Text;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.Hosting;

namespace Frontend.Host.Features.HttpForwarding;

/// <summary>Adds http communication with product APIs.</summary>
public interface IProductApiHttpClient
{
    Task<T?> GetFromJsonAsync<T>(ProductApi productApi, string pathAndQuery, CancellationToken cancellationToken);
    Task<HttpResponseMessage> GetEagerClientConfigAsync(ProductApi productApi, CancellationToken cancellationToken);
    Uri GetUri(ProductApi productApi);
}

internal sealed class ProductApiHttpClient(
    IProductApiConfiguration productApiConfiguration,
    IHttpClientFactory httpClientFactory,
    IDataCenterResolver dataCenterResolver,
    IEnvironmentProvider environmentProvider,
    ICurrentLanguageResolver currentLanguageResolver)
    : IProductApiHttpClient
{
    public const string HttpClientName = "ProductApi";
    public const string ClientConfigHttpClientName = "ProductApiClientConfig";

    public Task<T?> GetFromJsonAsync<T>(ProductApi productApi, string pathAndQuery, CancellationToken cancellationToken)
    {
        var httpClient = httpClientFactory.CreateClient(HttpClientName);
        var requestUrl = new Uri(GetUri(productApi), pathAndQuery);

        return httpClient.GetFromJsonAsync<T>(requestUrl, cancellationToken);
    }

    public Task<HttpResponseMessage> GetAsync(ProductApi productApi, string pathAndQuery, CancellationToken cancellationToken)
    {
        var httpClient = httpClientFactory.CreateClient(HttpClientName);
        var requestUrl = new Uri(GetUri(productApi), pathAndQuery);

        return httpClient.GetAsync(requestUrl, cancellationToken);
    }

    public Task<HttpResponseMessage> GetEagerClientConfigAsync(ProductApi productApi, CancellationToken cancellationToken)
    {
        var httpClient = httpClientFactory.CreateClient(ClientConfigHttpClientName);
        var requestUrl = new Uri(GetUri(productApi), $"{currentLanguageResolver.Language.RouteValue}/api/clientconfig");

        return httpClient.GetAsync(requestUrl, cancellationToken);
    }

    public Uri GetUri(ProductApi productApi)
    {
        var url = new StringBuilder(productApiConfiguration.Host)
            .Replace("{site}", dataCenterResolver.Site.Value)
            .Replace("{group}", dataCenterResolver.Group.Value)
            .Replace("{env}", GetEnvironment())
            .Replace("{productApi}", productApi.Value);

        return new Uri(url.ToString());
    }

    private string GetEnvironment()
    {
        if (environmentProvider.Environment.EqualsIgnoreCase("fvt"))
        {
            return "test";
        }

        return environmentProvider.Environment;
    }
}
