using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Execution;

/// <summary>
/// Creates <see cref="RestRequest" /> from <see cref="PosApiRestRequest" /> by executing all <see cref="IPosApiRestRequestBuilder" />-s.
/// </summary>
internal interface IPosApiRestRequestFactory
{
    RestRequest CreateRestRequest(PosApiRestRequest posApiRequest);
}

internal sealed class PosApiRestRequestFactory(IServiceClientsConfiguration config, IEnumerable<IPosApiRestRequestBuilder> restRequestBuilders)
    : IPosApiRestRequestFactory
{
    private readonly IReadOnlyList<IPosApiRestRequestBuilder> restRequestBuilders = restRequestBuilders.OrderVanillaFirst().ToArray(); // Vanilla first

    public RestRequest CreateRestRequest(PosApiRestRequest posApiRequest)
    {
        var restRequest = new RestRequest(BuildRequestUrl(posApiRequest), posApiRequest.Method);
        foreach (var builder in restRequestBuilders)
            builder.PrepareRestRequest(restRequest, posApiRequest);

        return restRequest;
    }

    private HttpUri BuildRequestUrl(PosApiRestRequest posApiRequest)
        => new UriBuilder(config.Host)
            .AppendPathSegment(config.Version)
            .AppendTrailingSlash()
            .CombineWith(posApiRequest.Url)
            .GetHttpUri();
}
