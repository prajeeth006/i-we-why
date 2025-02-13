using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>See corresponding docs at /health/dsl.</summary>
[ValueVolatility(ValueVolatility.Client)]
[Description(
    "Provides current position resolved by browser Geolocation API and corresponding location mapped by platform (via PosAPI)."
    + " Location properties are empty if there is no position or no location mapped or something failed."
    + " Position properties fail if there is no position because returning would be misleading as far as it's a valid value. Check " +
    nameof(HasPosition) + " first to avoid the failure."
    + " See Geolocation API docs for more details about position properties: https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates")]
public interface IGeolocationDslProvider
{
    /// <summary>See corresponding docs at /health/dsl.</summary>
    [Description(
        "Indicates if current position was resolved by browser therefore it's properties can be accessed.")]
    bool HasPosition { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [Description(
        "Time when current position was resolved by browser. It's a UNIX time so it can be compared with DateTime provider.")]
    decimal Timestamp { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [Description(nameof(Latitude) + GeolocationDslDocs.PositionSuffix)]
    decimal Latitude { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [Description(nameof(Longitude) + GeolocationDslDocs.PositionSuffix)]
    decimal Longitude { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [Description(nameof(Altitude) + GeolocationDslDocs.PositionSuffix)]
    decimal Altitude { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [Description(nameof(Accuracy) + GeolocationDslDocs.PositionSuffix)]
    decimal Accuracy { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [Description("Altitude accuracy" + GeolocationDslDocs.PositionSuffix)]
    decimal AltitudeAccuracy { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [Description(nameof(Heading) + GeolocationDslDocs.PositionSuffix)]
    decimal Heading { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [Description(nameof(Speed) + GeolocationDslDocs.PositionSuffix)]
    decimal Speed { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [Description("Id" + GeolocationDslDocs.LocationSuffix)]
    string? LocationId { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [Description("Name" + GeolocationDslDocs.LocationSuffix)]
    string? LocationName { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [Description(nameof(City) + GeolocationDslDocs.LocationSuffix)]
    string? City { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [Description(nameof(State) + GeolocationDslDocs.LocationSuffix)]
    string? State { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [Description(nameof(Zip) + GeolocationDslDocs.LocationSuffix)]
    string? Zip { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [Description(nameof(Country) + GeolocationDslDocs.LocationSuffix)]
    string? Country { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [ClientSideOnly]
    [Description("Value is retrived from the client side api.")]
    string? LocationNameClient { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [ClientSideOnly]
    [Description("Value is retrived from the client side api.")]
    string? CityClient { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [ClientSideOnly]
    [Description("Value is retrived from the client side api.")]
    string? CountryClient { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [ClientSideOnly]
    [Description("Value is retrived from the client side api.")]
    string? StateClient { get; }

    /// <summary>See corresponding docs at /health/dsl.</summary>
    [ClientSideOnly]
    [Description("Value is retrived from the client side api.")]
    string? PostcodeClient { get; }
}

internal static class GeolocationDslDocs
{
    public const string LocationSuffix = " of the curent location.";
    public const string PositionSuffix = " of the current position. Fails if there is none.";
}
