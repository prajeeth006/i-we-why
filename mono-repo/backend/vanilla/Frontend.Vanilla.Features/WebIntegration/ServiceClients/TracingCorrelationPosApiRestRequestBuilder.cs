using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.Diagnostics.Tracing;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.Features.WebIntegration.ServiceClients;

/// <summary>
/// Posts tracing header to PosAPI to be able to correlate its execution with a request coming to Vanilla app.
/// </summary>
internal sealed class TracingCorrelationPosApiRestRequestBuilder(ITracingIdsProvider tracingIdsProvider) : IPosApiRestRequestBuilder
{
    public void PrepareRestRequest(RestRequest restRequest, PosApiRestRequest posApiRequest)
    {
        var ids = tracingIdsProvider.GetTracingIds();
        restRequest.Headers[HttpHeaders.TraceParent] = ids.TraceParentHeader;
    }
}
