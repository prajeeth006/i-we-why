#nullable enable

using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders.Time;
using Frontend.Vanilla.Features.Geolocation;
using Frontend.Vanilla.Features.Geolocation.Dsl;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Geolocation.Dsl;

public class GeolocationDslProviderTests
{
    private readonly IGeolocationDslProvider target;
    private readonly Mock<IGeolocationDslResolver> resolver;
    private readonly Mock<IDslTimeConverter> dslTimeConverter;

    private readonly GeolocationPosition position;

    public GeolocationDslProviderTests()
    {
        resolver = new Mock<IGeolocationDslResolver>();
        dslTimeConverter = new Mock<IDslTimeConverter>();
        target = new GeolocationDslProvider(resolver.Object, dslTimeConverter.Object);

        position = new GeolocationPosition(
            TestTime.GetRandomUtc(),
            new GeolocationCoordinates(1, 2, 3, 4, 5, 6, 7),
            new MappedGeolocation("a", "b", "c", "d", "e", "f"));

        resolver.SetupWithAnyArgs(r => r.GetPosition(null!)).Returns(666m);
        resolver.SetupWithAnyArgs(r => r.GetLocation(null!)).Returns("xxx");
    }

    [Theory, BooleanData]
    public void HasPosition_ShouldDelegate(bool hasPosition)
    {
        resolver.SetupGet(r => r.HasPosition).Returns(hasPosition);
        target.HasPosition.Should().Be(hasPosition);
    }

    [Fact]
    public void Timestamp_ShouldGetFromPositionAndConvert()
    {
        dslTimeConverter.Setup(r => r.ToDsl(position.Timestamp.ValueWithOffset)).Returns(777m);
        Verify(target.Timestamp, 777m);
    }

    [Fact]
    public void Latitude_ShouldGetFromPosition()
        => Verify(target.Latitude, position.Coords.Latitude);

    [Fact]
    public void Longitude_ShouldGetFromPosition()
        => Verify(target.Longitude, position.Coords.Longitude);

    [Fact]
    public void Altitude_ShouldGetFromPosition()
        => Verify(target.Altitude, position.Coords.Altitude);

    [Fact]
    public void Accuracy_ShouldGetFromPosition()
        => Verify(target.Accuracy, position.Coords.Accuracy);

    [Fact]
    public void AltitudeAccuracy_ShouldGetFromPosition()
        => Verify(target.AltitudeAccuracy, position.Coords.AltitudeAccuracy);

    [Fact]
    public void Heading_ShouldGetFromPosition()
        => Verify(target.Heading, position.Coords.Heading);

    [Fact]
    public void Speed_ShouldGetFromPosition()
        => Verify(target.Speed, position.Coords.Speed);

    [Fact]
    public void LocationId_ShouldGetFromLocation()
        => Verify(target.LocationId, position.MappedLocation!.LocationId);

    [Fact]
    public void LocationName_ShouldGetFromLocation()
        => Verify(target.LocationName, position.MappedLocation!.LocationName);

    [Fact]
    public void City_ShouldGetFromLocation()
        => Verify(target.City, position.MappedLocation!.City);

    [Fact]
    public void State_ShouldGetFromLocation()
        => Verify(target.State, position.MappedLocation!.State);

    [Fact]
    public void Zip_ShouldGetFromLocation()
        => Verify(target.Zip, position.MappedLocation!.Zip);

    [Fact]
    public void Country_ShouldGetFromLocation()
        => Verify(target.Country, position.MappedLocation!.Country);

    private void Verify(decimal actualResult, decimal? expectedProperty)
    {
        actualResult.Should().Be(666m);

        var func = (Func<GeolocationPosition, decimal?>)resolver.Invocations.Single().Arguments.Single();
        func(position).Should().Be(expectedProperty);
    }

    private void Verify(string? actualResult, string? expectedProperty)
    {
        actualResult.Should().Be("xxx");

        var func = (Func<MappedGeolocation, string?>)resolver.Invocations.Single().Arguments.Single();
        func(position.MappedLocation!).Should().Be(expectedProperty);
    }
}
