using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders.Time;

namespace Frontend.Vanilla.Features.Geolocation.Dsl;

internal sealed class GeolocationDslProvider(IGeolocationDslResolver resolver, IDslTimeConverter dslTimeConverter) : IGeolocationDslProvider
{
    public bool HasPosition
        => resolver.HasPosition;

    public decimal Timestamp
        => resolver.GetPosition(p => dslTimeConverter.ToDsl(p.Timestamp.ValueWithOffset));

    public decimal Latitude
        => resolver.GetPosition(p => p.Coords.Latitude);

    public decimal Longitude
        => resolver.GetPosition(p => p.Coords.Longitude);

    public decimal Altitude
        => resolver.GetPosition(p => p.Coords.Altitude);

    public decimal Accuracy
        => resolver.GetPosition(p => p.Coords.Accuracy);

    public decimal AltitudeAccuracy
        => resolver.GetPosition(p => p.Coords.AltitudeAccuracy);

    public decimal Heading
        => resolver.GetPosition(p => p.Coords.Heading);

    public decimal Speed
        => resolver.GetPosition(p => p.Coords.Speed);

    public string? LocationId
        => resolver.GetLocation(l => l.LocationId);

    public string? LocationName
        => resolver.GetLocation(l => l.LocationName);

    public string? City
        => resolver.GetLocation(l => l.City);

    public string? State
        => resolver.GetLocation(l => l.State);

    public string? Zip
        => resolver.GetLocation(l => l.Zip);

    public string? Country
        => resolver.GetLocation(l => l.Country);

    public string? LocationNameClient
        => throw new ClientSideOnlyException();

    public string? CityClient
        => throw new ClientSideOnlyException();

    public string? CountryClient
        => throw new ClientSideOnlyException();

    public string? StateClient
        => throw new ClientSideOnlyException();

    public string? PostcodeClient
        => throw new ClientSideOnlyException();
}
