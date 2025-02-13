using System.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.Rest.Formatters;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Frontend.Host.Features.Redirex;

internal interface IRedirexService
{
    Task<RestResponse> HealthCheckAsync(CancellationToken cancellationToken);
    Task<RedirexResponse?> PostAsync(RedirexRequestData request, CancellationToken cancellationToken);
    bool ShouldSkip(HttpContext httpContext);
}

internal sealed class RedirexService(
    IRestClient restClient,
    IRedirexConfiguration config) : IRedirexService
{
    public const string SkipHeaderName = "X-RediRex-Skip";

    public async Task<RestResponse> HealthCheckAsync(CancellationToken cancellationToken)
    {
        var request = new RestRequest(new HttpUri(config.ServiceUrl.AbsoluteUri + "/health/report"))
        {
            Timeout = config.RequestTimeout,
        };

        try
        {
            return await restClient.ExecuteAsync(request, cancellationToken);
        }
        catch (Exception ex)
        {
            var msg = $"Failed request to Redirex service: {request}"
                      + $" Investigate the configuration '{RedirexConfiguration.FeatureName}' and"
                      + " connection from Vanilla server(s) to redirex api service";

            throw new Exception(msg, ex);
        }
    }

    public async Task<RedirexResponse?> PostAsync(RedirexRequestData data, CancellationToken cancellationToken)
    {
        var request = new RestRequest(new HttpUri(config.ServiceUrl.AbsoluteUri + "/redirect/"), HttpMethod.Post)
        {
            Timeout = config.RequestTimeout,
            FollowRedirects = false,
            Content = new RestRequestContent(data, NewtonsoftJsonFormatter.Default),
        };

        var response = await restClient.ExecuteAsync(request, cancellationToken);

        return response.StatusCode != HttpStatusCode.OK ? null : JsonConvert.DeserializeObject<RedirexResponse>(response.Content.DecodeToString());
    }

    public bool ShouldSkip(HttpContext httpContext) => httpContext.Request.Headers.ContainsKey(SkipHeaderName);
}
