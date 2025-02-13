using FluentAssertions;
using Frontend.Vanilla.Features.Geolocation;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Geolocation;

public class GeolocationPositionTests
{
    [Fact]
    public void ShouldCreateCorrectly()
    {
        var coords = new GeolocationCoordinates();
        var timestamp = TestTime.GetRandomUtc();
        var location = new MappedGeolocation("123");

        // Act
        var target = new GeolocationPosition(timestamp, coords, location);

        target.Timestamp.Should().Be(timestamp);
        target.Coords.Should().BeSameAs(coords);
        target.MappedLocation.Should().BeSameAs(location);
    }
}
