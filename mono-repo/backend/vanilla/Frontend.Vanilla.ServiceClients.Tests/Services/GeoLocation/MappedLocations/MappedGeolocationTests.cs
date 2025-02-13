using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.GeoLocation.MappedLocations;

public class MappedGeolocationTests
{
    [Fact]
    public void ShouldCreateCorrectly()
    {
        // Act
        var target = new MappedGeolocation(
            locationId: "1234",
            locationName: "NY",
            city: "New York",
            state: "US",
            zip: "1234",
            country: "NY");

        target.LocationId.Should().Be("1234");
        target.LocationName.Should().Be("NY");
        target.City.Should().Be("New York");
        target.State.Should().Be("US");
        target.Zip.Should().Be("1234");
        target.Country.Should().Be("NY");
    }

    [Fact]
    public void ShouldDeserializeCorrectlyFromPosApi()
    {
        const string json = @"{
                ""locationId"": ""1234"",
                ""locationName"": ""NY"",
                ""city"": ""New York"",
                ""state"": ""US"",
                ""zip"": ""1234"",
                ""country"": ""NY""
            }";

        // Act
        var result = PosApiSerializationTester.Deserialize<MappedGeolocation>(json);

        result.Should().BeEquivalentTo(new MappedGeolocation(
            locationId: "1234",
            locationName: "NY",
            city: "New York",
            state: "US",
            zip: "1234",
            country: "NY"));
    }
}
