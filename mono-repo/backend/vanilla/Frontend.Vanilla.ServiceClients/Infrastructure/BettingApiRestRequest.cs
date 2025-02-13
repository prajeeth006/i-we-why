#nullable enable

using System.Net.Http;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.ServiceClients.Infrastructure;

/// <summary>
/// Defines a REST request made to Betting API using <see cref="IPosApiRestClient" />.
/// </summary>
public sealed class BettingApiRestRequest : BettingApiRestRequestBase
{
    /// <summary>Creates a new instance.</summary>
    public BettingApiRestRequest(PathRelativeUri url, HttpMethod? method = null)
        : base(url, method) { }
}
