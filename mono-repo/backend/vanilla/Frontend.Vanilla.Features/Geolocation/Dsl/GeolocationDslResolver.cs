using System;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;

namespace Frontend.Vanilla.Features.Geolocation.Dsl;

internal interface IGeolocationDslResolver
{
    bool HasPosition { get; }
    decimal GetPosition(Func<GeolocationPosition, decimal?> getValue);
    string? GetLocation(Func<MappedGeolocation, string?> getValue);
}

internal sealed class GeolocationDslResolver(IGeolocationService geolocationService) : IGeolocationDslResolver
{
    public bool HasPosition
        => geolocationService.CurrentPosition != null;

    public decimal GetPosition(Func<GeolocationPosition, decimal?> getValue)
    {
        var position = geolocationService.CurrentPosition
                       ?? throw new Exception("Currently there is no position resolved by browser so its properties can't be accessed."
                                              + " Returning zero would be misleading as far as it's a valid value. Check HasPosition first.");

        return getValue(position) ?? 0m;
    }

    public string? GetLocation(Func<MappedGeolocation, string?> getValue)
    {
        var location = geolocationService.CurrentPosition?.MappedLocation;

        return location != null ? getValue(location) : null;
    }
}
