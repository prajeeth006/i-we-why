using System;
using System.Net.Http;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Rest;

/// <summary>
/// Configurable REST request with all data required to execute it.
/// </summary>
public sealed class RestRequest
{
    /// <summary>Creates a new instance.</summary>
    public RestRequest(HttpUri url, HttpMethod? method = null)
    {
        this.url = Guard.NotNull(url, nameof(url));
        this.method = method ?? HttpMethod.Get;
    }

    private HttpUri url;

    /// <summary>Gets or sets request URL.</summary>
    public HttpUri Url
    {
        get => url;
        set => url = Guard.NotNull(value, nameof(value));
    }

    private HttpMethod method;

    /// <summary>Gets or sets HTTP method.</summary>
    public HttpMethod Method
    {
        get => method;
        set => method = Guard.NotNull(value, nameof(value));
    }

    /// <summary>Gets HTTP headers.</summary>
    public RestRequestHeaders Headers { get; } = new RestRequestHeaders();

    /// <summary>Gets or sets content which should be posted.</summary>
    public RestRequestContent? Content { get; set; }

    private TimeSpan timeout = TimeSpan.FromSeconds(100);

    /// <summary>Gets or sets timeout. Default: 100 seconds.</summary>
    public TimeSpan Timeout
    {
        get => timeout;
        set => timeout = Guard.GreaterOrEqual(value, TimeSpan.FromMilliseconds(1), nameof(value));
    }

    /// <summary>Gets or sets a value that indicates whether the handler should follow redirection responses. Default: true.</summary>
    public bool FollowRedirects { get; set; } = true;

    /// <summary>Returns method with URL e.g. "GET https://en.wikipedia.org/wiki/Batman".</summary>
    public override string ToString()
        => Method.ToString().ToUpper() + " " + Url;
}
