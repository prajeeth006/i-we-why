#nullable enable

using System.Net.Http;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.ServiceClients.Infrastructure;

/// <summary>
/// Defines a REST request made to Pos API using <see cref="IPosApiRestClient" />.
/// </summary>
public class PosApiRestRequest
{
    /// <summary>
    /// Creates a new instance.
    /// </summary>
    public PosApiRestRequest(PathRelativeUri url, HttpMethod? method = null)
    {
        this.url = Guard.NotNull(url, nameof(url));
        this.method = method ?? HttpMethod.Get;
    }

    private PathRelativeUri url;

    /// <summary>Gets or sets the URL. It has to be relative from configured PosAPI host and version.</summary>
    public PathRelativeUri Url
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

    /// <summary>
    /// Indicates if the request should be authenticated thus posting security tokens.
    /// In that case user must be authenticated with PosAPI (full authentication or be in workflow).
    /// </summary>
    public bool Authenticate { get; set; }

    /// <summary>Gets or sets the object which should be serialized and posted.</summary>
    public object? Content { get; set; }

    /// <summary>Gets HTTP request headers.</summary>
    public RestRequestHeaders Headers { get; } = new RestRequestHeaders();
}
