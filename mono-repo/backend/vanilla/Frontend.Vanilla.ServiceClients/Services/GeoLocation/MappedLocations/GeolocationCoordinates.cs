namespace Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;

/// <summary>Position coordinates resolved by Geolocation browser API.</summary>
public sealed class GeolocationCoordinates
{
#pragma warning disable CS1591 // Just dummy data -> no docs needed
    public GeolocationCoordinates() { }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public decimal? Altitude { get; set; }
    public decimal Accuracy { get; set; }
    public decimal? AltitudeAccuracy { get; set; }
    public decimal? Heading { get; set; }
    public decimal? Speed { get; set; }

    public GeolocationCoordinates(
        decimal latitude = 0,
        decimal longitude = 0,
        decimal? altitude = null,
        decimal accuracy = 0,
        decimal? altitudeAccuracy = null,
        decimal? heading = null,
        decimal? speed = null)
    {
        Latitude = latitude;
        Longitude = longitude;
        Altitude = altitude;
        Accuracy = accuracy;
        AltitudeAccuracy = altitudeAccuracy;
        Heading = heading;
        Speed = speed;
    }
}
