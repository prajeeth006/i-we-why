using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;

namespace Frontend.Vanilla.Features.Geolocation.PosApi;

internal sealed class GeolocationLoginFilter(IGeolocationService geolocationService) : LoginFilter
{
    public override void BeforeLogin(BeforeLoginContext context)
    {
        if (!(context.Request.Content is CommonLoginParameters parameters))
            return;

        var coords = geolocationService.CurrentPosition?.Coords;

        if (coords == null)
            return;

        var coordsData = new (string Key, decimal? Value)[]
        {
            ("GEO_LATITUDE", coords.Latitude),
            ("GEO_LONGITUDE", coords.Longitude),
            ("GEO_ALTITUDE", coords.Altitude),
            ("GEO_ACCURACY", coords.Accuracy),
            ("GEO_ALT_ACCURACY", coords.AltitudeAccuracy),
            ("GEO_HEADING", coords.Heading),
            ("GEO_SPEED", coords.Speed),
        };
        parameters.RequestData.Add(coordsData.Select(d => (d.Key, d.Value?.ToInvariantString())), KeyConflictResolution.Skip);
    }
}
