#nullable enable

namespace Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;

/// <summary>Location mapped by platform (via PosAPI) from a position resolved by Geolocation browser API.</summary>
public sealed class MappedGeolocation(
    string? locationId = null,
    string? locationName = null,
    string? city = null,
    string? state = null,
    string? zip = null,
    string? country = null)
{
#pragma warning disable CS1591 // Just dummy data -> no docs needed
    public string? LocationId { get; } = locationId;
    public string? LocationName { get; } = locationName;
    public string? City { get; } = city;
    public string? State { get; } = state;
    public string? Zip { get; } = zip;
    public string? Country { get; } = country;
}
