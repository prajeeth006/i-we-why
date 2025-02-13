using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Geolocation;

[AllowAnonymous]
[Route("{culture}/api")]
public class GeolocationController : BaseController
{
    private readonly IPosApiGeoLocationService posApiGeoLocationService;

    internal GeolocationController(IPosApiGeoLocationService posApiGeoLocationService)
        => this.posApiGeoLocationService = posApiGeoLocationService;

    public GeolocationController(IServiceProvider c)
        : this(c.GetRequiredService<IPosApiGeoLocationService>()) { }

    [HttpGet("mappedGeolocation")]
    [NeverRenewAuthentication]
    public async Task<IActionResult> MappedGeolocation([FromQuery] GeolocationCoordinates coordinates, CancellationToken cancellationToken)
    {
        var location = await posApiGeoLocationService.GetMappedLocationAsync(coordinates, cancellationToken);

        return Ok(new { location });
    }
}
