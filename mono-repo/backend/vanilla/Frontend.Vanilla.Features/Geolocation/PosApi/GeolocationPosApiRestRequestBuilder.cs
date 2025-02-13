using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.Features.Geolocation.PosApi;

internal sealed class GeolocationPosApiRestRequestBuilder(IGeolocationService geolocationService) : IPosApiRestRequestBuilder
{
    public void PrepareRestRequest(RestRequest restRequest, PosApiRestRequest posApiRequest)
    {
        var locationId = geolocationService.CurrentPosition?.MappedLocation?.LocationId;
        restRequest.Headers[PosApiHeaders.LocationId] = locationId;
    }
}
