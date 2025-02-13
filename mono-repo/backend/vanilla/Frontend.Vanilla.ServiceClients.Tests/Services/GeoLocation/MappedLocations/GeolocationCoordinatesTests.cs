using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.GeoLocation.MappedLocations;

public class GeolocationCoordinatesTests
{
    [Fact]
    public void ShouldCreateCorrectly()
    {
        // Act
        var target = new GeolocationCoordinates(
            latitude: 1,
            longitude: 2,
            altitude: 3,
            accuracy: 4,
            altitudeAccuracy: 5,
            heading: 6,
            speed: 7);

        target.Latitude.Should().Be(1);
        target.Longitude.Should().Be(2);
        target.Altitude.Should().Be(3);
        target.Accuracy.Should().Be(4);
        target.AltitudeAccuracy.Should().Be(5);
        target.Heading.Should().Be(6);
        target.Speed.Should().Be(7);
    }
}
