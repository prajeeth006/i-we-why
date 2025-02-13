using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;

namespace Frontend.Vanilla.Features.Geolocation;

/// <summary>Position resolved by Geolocation browser API including location mapped by platform (via PosAPI).</summary>
public sealed class GeolocationPosition
{
    /// <summary>Gets the time when <see cref="Coords" /> were obtained.</summary>
    public UtcDateTime Timestamp { get; }

    /// <summary>Gets geolocation coordinates.</summary>
    public GeolocationCoordinates Coords { get; }

    /// <summary>Gets location mapped to <see cref="Coords" /> on the backend.</summary>
    public MappedGeolocation? MappedLocation { get; }

    /// <summary>Creates a new instance.</summary>
    public GeolocationPosition(UtcDateTime timestamp, GeolocationCoordinates coords, MappedGeolocation? mappedLocation)
    {
        Timestamp = timestamp;
        Coords = Guard.NotNull(coords, nameof(coords));
        MappedLocation = mappedLocation;
    }
}
