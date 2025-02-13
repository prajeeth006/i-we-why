using System;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Execution;

internal sealed class ExtendedApiRestRequestBuilder(IExtendedServiceClientsConfiguration serviceClientsConfiguration) : IPosApiRestRequestBuilder
{
    public void PrepareRestRequest(RestRequest restRequest, PosApiRestRequest posApiRequest)
    {
        if (posApiRequest is ExtendedApiRestRequest)
        {
            restRequest.Url = new UriBuilder(serviceClientsConfiguration.Host)
                .AppendPathSegment(serviceClientsConfiguration.Version)
                .AppendTrailingSlash()
                .CombineWith(posApiRequest.Url)
                .GetHttpUri();
        }
    }
}
