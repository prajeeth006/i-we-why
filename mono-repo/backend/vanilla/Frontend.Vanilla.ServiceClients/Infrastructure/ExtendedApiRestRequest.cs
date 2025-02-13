#nullable enable

using System.Net.Http;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.ServiceClients.Infrastructure;

/// <summary>
/// Defines a REST request made to Extended API aka xPOS using <see cref="IPosApiRestClient" />.
/// </summary>
public sealed class ExtendedApiRestRequest : PosApiRestRequest
{
    /// <summary>Creates a new instance.</summary>
    public ExtendedApiRestRequest(PathRelativeUri url, HttpMethod? method = null)
        : base(url, method) { }
}
