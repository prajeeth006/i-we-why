#nullable enable

using System;
using FluentAssertions;
using Frontend.Vanilla.Features.Geolocation;
using Frontend.Vanilla.Features.Geolocation.Dsl;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Geolocation.Dsl;

public class GeolocationDslResolverTests
{
    private readonly IGeolocationDslResolver target;
    private readonly Mock<IGeolocationService> geolocationService;

    private readonly Mock<Func<GeolocationPosition, decimal?>> positionFunc;
    private readonly Mock<Func<MappedGeolocation, string?>> locationFunc;

    public GeolocationDslResolverTests()
    {
        geolocationService = new Mock<IGeolocationService>();
        target = new GeolocationDslResolver(geolocationService.Object);

        positionFunc = new Mock<Func<GeolocationPosition, decimal?>>();
        locationFunc = new Mock<Func<MappedGeolocation, string?>>();
    }

    [Theory, BooleanData]
    public void HasPosition_ShouldReturnTrue_IfPositionIsNotNull(bool hasPosition)
    {
        if (hasPosition) SetupPosition();
        target.HasPosition.Should().Be(hasPosition);
    }

    [Fact]
    public void GetPosition_ShouldGetPropertyFromPosition()
    {
        var position = SetupPosition();
        positionFunc.Setup(f => f(position)).Returns(666m);

        // Act
        var result = target.GetPosition(positionFunc.Object);

        result.Should().Be(666m);
    }

    [Fact]
    public void GetPosition_ShouldReplaceNullWithZero()
    {
        SetupPosition();

        // Act
        var result = target.GetPosition(positionFunc.Object);

        result.Should().Be(0);
    }

    [Fact]
    public void GetPosition_ShouldThrow_IfNoPosition()
    {
        Action act = () => target.GetPosition(positionFunc.Object);

        act.Should().Throw().Which.Message.Should().ContainAll("no position", nameof(target.HasPosition));
        positionFunc.VerifyNoOtherCalls();
    }

    [Fact]
    public void GetLocation_ShouldGetPropertyFromLocation()
    {
        var location = new MappedGeolocation();
        SetupPosition(location);
        locationFunc.Setup(f => f(location)).Returns("xxx");

        // Act
        var result = target.GetLocation(locationFunc.Object);

        result.Should().Be("xxx");
    }

    [Theory, BooleanData]
    public void GetLocation_ShouldGetNull_IfNoLocation(bool hasPosition)
    {
        if (hasPosition) SetupPosition();

        // Act
        var result = target.GetLocation(locationFunc.Object);

        result.Should().BeNull();
        locationFunc.VerifyNoOtherCalls();
    }

    private GeolocationPosition SetupPosition(MappedGeolocation? location = null)
    {
        var position = new GeolocationPosition(TestTime.GetRandomUtc(), new GeolocationCoordinates(), location);
        geolocationService.SetupGet(s => s.CurrentPosition).Returns(position);

        return position;
    }
}
