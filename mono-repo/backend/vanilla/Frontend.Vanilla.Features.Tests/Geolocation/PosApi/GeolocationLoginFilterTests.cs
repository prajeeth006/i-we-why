#nullable enable

using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.Geolocation;
using Frontend.Vanilla.Features.Geolocation.PosApi;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Geolocation.PosApi;

public class GeolocationLoginFilterTests
{
    private readonly LoginFilter target;
    private readonly Mock<IGeolocationService> geolocationService;
    private readonly BeforeLoginContext ctx;

    public GeolocationLoginFilterTests()
    {
        geolocationService = new Mock<IGeolocationService>();
        target = new GeolocationLoginFilter(geolocationService.Object);

        ctx = new BeforeLoginContext(default, new PosApiRestRequest(new PathRelativeUri("path")) { Content = new TestParameters() });
        geolocationService.SetupGet(s => s.CurrentPosition).Returns(new GeolocationPosition(default, new GeolocationCoordinates(1.1m, 2.2m, 3, 4, 5, 6, 7), null));
    }

    [Fact]
    public void ShouldAddGeolocationToRequestData()
    {
        TestCulture.Set("de-AT"); // Tests that numbers use invariant format

        // Act
        target.BeforeLogin(ctx);

        RequestData.Should().BeEquivalentTo(new Dictionary<string, string>
        {
            { "GEO_LATITUDE", "1.1" },
            { "GEO_LONGITUDE", "2.2" },
            { "GEO_ALTITUDE", "3" },
            { "GEO_ACCURACY", "4" },
            { "GEO_ALT_ACCURACY", "5" },
            { "GEO_HEADING", "6" },
            { "GEO_SPEED", "7" },
        });
    }

    [Fact]
    public void ShouldNotAddGeolocation_IfNoPosition()
    {
        geolocationService.SetupGet(s => s.CurrentPosition).Returns(() => null);

        // Act
        target.BeforeLogin(ctx);

        RequestData.Should().BeEmpty();
    }

    [Fact]
    public void ShouldNotDoAnything_IfNotLoginParameters()
    {
        ctx.Request.Content = "LOL";

        // Act
        target.BeforeLogin(ctx);

        ctx.Request.Content.Should().Be("LOL");
        geolocationService.VerifyNoOtherCalls();
    }

    private IDictionary<string, string?>? RequestData => ((TestParameters?)ctx.Request.Content)!.RequestData;

    internal class TestParameters : CommonLoginParameters { }
}
