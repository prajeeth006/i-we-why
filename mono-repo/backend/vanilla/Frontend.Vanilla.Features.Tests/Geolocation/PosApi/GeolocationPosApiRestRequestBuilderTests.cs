#nullable enable

using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.Geolocation;
using Frontend.Vanilla.Features.Geolocation.PosApi;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Geolocation.PosApi;

public class GeolocationPosApiRestRequestBuilderTests
{
    private readonly IPosApiRestRequestBuilder target;
    private readonly Mock<IGeolocationService> geolocationService;

    private readonly RestRequest restRequest;
    private readonly PosApiRestRequest posApiRequest;

    public GeolocationPosApiRestRequestBuilderTests()
    {
        geolocationService = new Mock<IGeolocationService>();
        target = new GeolocationPosApiRestRequestBuilder(geolocationService.Object);

        restRequest = new RestRequest(new HttpUri("http://poapi"));
        posApiRequest = new PosApiRestRequest(new PathRelativeUri("srv"));
    }

    public static TheoryData<GeolocationPosition?, string?> TestCases => new TheoryData<GeolocationPosition?, string?>
    {
        { new GeolocationPosition(default, new GeolocationCoordinates(), new MappedGeolocation("xxx")), "xxx" },
        { new GeolocationPosition(default, new GeolocationCoordinates(), null), null },
        { null, null },
    };

    [Theory]
    [MemberData(nameof(TestCases))]
    public void ShouldAppendLocationId(GeolocationPosition? position, string? expectedHeader)
    {
        geolocationService.SetupGet(s => s.CurrentPosition).Returns(position);

        // Act
        target.PrepareRestRequest(restRequest, posApiRequest);

        restRequest.Headers.Should().BeEquivalentTo(new Dictionary<string, StringValues> { { PosApiHeaders.LocationId, expectedHeader } });
    }
}
