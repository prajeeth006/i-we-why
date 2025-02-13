#nullable enable

using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Geolocation;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Geolocation;

public class GeolocationServiceTests
{
    private readonly IGeolocationService target;
    private readonly Mock<IHttpContextAccessor> httpContextAccessor;
    private readonly Mock<ICookieHandler> cookieHandler;
    private readonly TestLogger<GeolocationService> log;

    public GeolocationServiceTests()
    {
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        cookieHandler = new Mock<ICookieHandler>();
        log = new TestLogger<GeolocationService>();
        target = new GeolocationService(httpContextAccessor.Object, cookieHandler.Object, log);

        var serviceProviderMock = new Mock<IServiceProvider>();
        serviceProviderMock.Setup(_ => _.GetService(typeof(IRequestScopedValuesProvider))).Returns(new RequestScopedValuesProvider());
        httpContextAccessor.Setup(c => c.HttpContext!.RequestServices).Returns(serviceProviderMock.Object);
    }

    [Fact]
    public void ShouldDeserializeFromCookieAndCacheIt()
    {
        cookieHandler.Setup(h => h.GetValue(GeolocationService.CookieName)).Returns(
            "%7B"
            + "%22coords%22%3A%7B"
            + "%22latitude%22%3A48.1984512%2C"
            + "%22longitude%22%3A16.3872768%2C"
            + "%22altitude%22%3A123%2C"
            + "%22accuracy%22%3A1818%2C"
            + "%22altitudeAccuracy%22%3A4%2C"
            + "%22heading%22%3A5%2C"
            + "%22speed%22%3A6%7D%2C"
            + "%22timestamp%22%3A1592205720544%2C"
            + "%22mappedLocation%22%3A%7B"
            + "%22locationId%22%3A%22xxx%22%2C"
            + "%22locationName%22%3A%22Laufhaus%20Wien%20Mitte%22%2C"
            + "%22city%22%3A%22Wien%22%2C"
            + "%22state%22%3A%22W%22%2C"
            + "%22zip%22%3A%221030%22%2C"
            + "%22country%22%3A%22AT%22"
            + "%7D%7D");

        // Act
        var result = RunAndExpectCached();

        result.Should().BeEquivalentTo(new GeolocationPosition(
            new UtcDateTime(2020, 6, 15, 7, 22, 0, 544),
            new GeolocationCoordinates(
                latitude: 48.1984512m,
                longitude: 16.3872768m,
                altitude: 123,
                accuracy: 1818,
                altitudeAccuracy: 4,
                heading: 5,
                speed: 6),
            new MappedGeolocation(
                locationId: "xxx",
                locationName: "Laufhaus Wien Mitte",
                city: "Wien",
                state: "W",
                zip: "1030",
                country: "AT")));
        log.VerifyNothingLogged();
    }

    [Theory, ValuesData(null, "", "  ")]
    public void ShouldReturnNullAndCacheIt_IfEmptyCookie(string? cookieValue)
    {
        cookieHandler.Setup(h => h.GetValue(GeolocationService.CookieName)).Returns(cookieValue);

        // Act
        var result = RunAndExpectCached();

        result.Should().BeNull();
        log.VerifyNothingLogged();
    }

    [Fact]
    public void ShouldReturnNullAndCacheIt_IfInvalidValue()
    {
        cookieHandler.Setup(h => h.GetValue(GeolocationService.CookieName)).Returns("bullshit");

        // Act
        var result = RunAndExpectCached();

        result.Should().BeNull();
        log.Logged.Single().Verify(
            LogLevel.Error,
            e => e is JsonReaderException,
            ("cookie", GeolocationService.CookieName),
            ("value", "bullshit"));
    }

    [Fact]
    public void ShouldReturnNull_IfNoHttpContext()
    {
        httpContextAccessor.SetupGet(a => a.HttpContext).Returns(() => null);

        // Act
        var result = target.CurrentPosition;

        result.Should().BeNull();
        cookieHandler.VerifyNoOtherCalls();
    }

    private GeolocationPosition? RunAndExpectCached()
    {
        // Act
        var result1 = target.CurrentPosition;
        var result2 = target.CurrentPosition;

        result1.Should().BeSameAs(result2);
        cookieHandler.Invocations.Should().HaveCount(1);

        return result1;
    }
}
