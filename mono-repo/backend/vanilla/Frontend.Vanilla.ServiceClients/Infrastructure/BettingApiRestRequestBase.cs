using System.Net.Http;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.ServiceClients.Infrastructure;

/// <summary>
/// A base class for REST requests made to Betting API using <see cref="IPosApiRestClient" />.
/// </summary>
public abstract class BettingApiRestRequestBase : PosApiRestRequest
{
    /// <summary>Creates a new instance.</summary>
    protected BettingApiRestRequestBase(PathRelativeUri url, HttpMethod method = null)
        : base(url, method) { }
}
