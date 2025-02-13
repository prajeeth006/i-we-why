using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.Geolocation;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.Geolocation;

public class GeolocationControllerTests
{
    private readonly GeolocationController target;
    private readonly Mock<IPosApiGeoLocationService> posApiGeoLocationService;

    public GeolocationControllerTests()
    {
        posApiGeoLocationService = new Mock<IPosApiGeoLocationService>();
        target = new GeolocationController(posApiGeoLocationService.Object);
    }

    [Fact]
    public async Task ShouldMapCoordinatesToLocation()
    {
        var ct = new CancellationTokenSource().Token;
        var coords = new GeolocationCoordinates(1, 2);
        var location = new MappedGeolocation("Laufhaus Wien Mitte");
        posApiGeoLocationService.Setup(s => s.GetMappedLocationAsync(coords, ct)).ReturnsAsync(location);

        // Act
        var result = await target.MappedGeolocation(coords, ct);
        result.Should().BeOfType<OkObjectResult>();

        var okObjectResult = result as OkObjectResult;
        Assert.NotNull(okObjectResult);

        okObjectResult.Value.Should().BeEquivalentTo(new { location });
    }
}
