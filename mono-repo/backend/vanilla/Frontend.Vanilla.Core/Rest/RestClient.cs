using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Rest;

/// <summary>
/// Central class for executing <see cref="RestRequest" />.
/// On the contrary to <see cref="HttpWebRequest" />, response is returned for any <see cref="HttpStatusCode" />.
/// </summary>
public interface IRestClient
{
    /// <summary>Executes given REST request synchronously.</summary>
    RestResponse Execute(RestRequest request);

    /// <summary>Executes given REST request asynchronously.</summary>
    Task<RestResponse> ExecuteAsync(RestRequest request, CancellationToken cancellationToken);

    /// <summary>Executes given REST request according to given mode.</summary>
    Task<RestResponse> ExecuteAsync(ExecutionMode mode, RestRequest request);
}

internal abstract class RestClientBase : IRestClient
{
    private readonly IHttpClientFactory httpClientFactory;
    internal const string HttpClientNameWithAllowAutoRedirect = "HttpClientNameWithAllowAutoRedirect";
    internal const string HttpClientNameWithoutAllowAutoRedirect = "HttpClientNameWithoutAllowAutoRedirect";

    /// <summary>Just for easier testing.</summary>
    internal RestClientBase()
    {
        httpClientFactory = null!;
    }

    public RestClientBase(IHttpClientFactory httpClientFactory)
    {
        this.httpClientFactory = httpClientFactory;
    }

    internal HttpClient GetHttpClient(RestRequest request)
    {
        var httpClient = httpClientFactory.CreateClient(request.FollowRedirects ? HttpClientNameWithAllowAutoRedirect : HttpClientNameWithoutAllowAutoRedirect);
        httpClient.Timeout = request.Timeout;

        return httpClient;
    }

    public abstract Task<RestResponse> ExecuteAsync(ExecutionMode mode, RestRequest request);

    RestResponse IRestClient.Execute(RestRequest request)
        => ExecutionMode.ExecuteSync(ExecuteAsync, request);

    Task<RestResponse> IRestClient.ExecuteAsync(RestRequest request, CancellationToken cancellationToken)
        => ExecuteAsync(ExecutionMode.Async(cancellationToken), request);
}

internal sealed class RestClient(IHttpClientFactory httpClientFactory) : RestClientBase(httpClientFactory)
{
    public override async Task<RestResponse> ExecuteAsync(ExecutionMode mode, RestRequest request)
    {
        Guard.NotNull(request, nameof(request));
        Guard.AbsoluteUri(request.Url, nameof(request), "The request can be executed only with an absolute URL. Relative URL can be used during request building.");

        var start = Stopwatch.GetTimestamp();
        var httpClient = GetHttpClient(request);
        using var httpRequestMessage = RestRequestConverter.Convert(request);

        try
        {
            var httpResponseMessage = mode.AsyncCancellationToken is not null ?
                await httpClient.SendAsync(httpRequestMessage, mode.AsyncCancellationToken.Value) : httpClient.Send(httpRequestMessage);

            return await RestResponseConverter.ConvertAsync(httpResponseMessage, request, Stopwatch.GetElapsedTime(start));
        }
        catch (TaskCanceledException ex) when (mode.AsyncCancellationToken?.IsCancellationRequested == true)
        {
            throw new OperationCanceledException($"The HTTP request {request} was cancelled externally by provided cancellation token.", ex, mode.AsyncCancellationToken.Value);
        }
        catch (TaskCanceledException ex) when (ex.InnerException is TimeoutException)
        {
            throw new TimeoutException($"The HTTP request {request} timed out after specified {request.Timeout}.", ex);
        }
        catch (HttpRequestException ex)
        {
            throw new RestNetworkException($"Failed HTTP request {request} on network level: {ex.Message}.", ex);
        }
    }
}
