using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class GeolocationDslProviderSyntaxTests : SyntaxTestBase<IGeolocationDslProvider>
{
    [Theory, BooleanData]
    public void HasPositionTest(bool value)
    {
        Provider.SetupGet(p => p.HasPosition).Returns(value);
        EvaluateAndExpect("Geolocation.HasPosition", value);
    }

    [Fact]
    public void TimestampTest()
    {
        Provider.SetupGet(p => p.Timestamp).Returns(1m);
        EvaluateAndExpect("Geolocation.Timestamp", 1m);
    }

    [Fact]
    public void LatitudeTest()
    {
        Provider.SetupGet(p => p.Latitude).Returns(2m);
        EvaluateAndExpect("Geolocation.Latitude", 2m);
    }

    [Fact]
    public void LongitudeTest()
    {
        Provider.SetupGet(p => p.Longitude).Returns(3m);
        EvaluateAndExpect("Geolocation.Longitude", 3m);
    }

    [Fact]
    public void AltitudeTest()
    {
        Provider.SetupGet(p => p.Altitude).Returns(4m);
        EvaluateAndExpect("Geolocation.Altitude", 4m);
    }

    [Fact]
    public void AccuracyTest()
    {
        Provider.SetupGet(p => p.Accuracy).Returns(5m);
        EvaluateAndExpect("Geolocation.Accuracy", 5m);
    }

    [Fact]
    public void AltitudeAccuracyTest()
    {
        Provider.SetupGet(p => p.AltitudeAccuracy).Returns(6m);
        EvaluateAndExpect("Geolocation.AltitudeAccuracy", 6m);
    }

    [Fact]
    public void HeadingTest()
    {
        Provider.SetupGet(p => p.Heading).Returns(7m);
        EvaluateAndExpect("Geolocation.Heading", 7m);
    }

    [Fact]
    public void SpeedTest()
    {
        Provider.SetupGet(p => p.Speed).Returns(8m);
        EvaluateAndExpect("Geolocation.Speed", 8m);
    }

    [Fact]
    public void LocationIdTest()
    {
        Provider.SetupGet(p => p.LocationId).Returns("a");
        EvaluateAndExpect("Geolocation.LocationId", "a");
    }

    [Fact]
    public void LocationNameTest()
    {
        Provider.SetupGet(p => p.LocationName).Returns("b");
        EvaluateAndExpect("Geolocation.LocationName", "b");
    }

    [Fact]
    public void CityTest()
    {
        Provider.SetupGet(p => p.City).Returns("c");
        EvaluateAndExpect("Geolocation.City", "c");
    }

    [Fact]
    public void StateTest()
    {
        Provider.SetupGet(p => p.State).Returns("d");
        EvaluateAndExpect("Geolocation.State", "d");
    }

    [Fact]
    public void ZipTest()
    {
        Provider.SetupGet(p => p.Zip).Returns("e");
        EvaluateAndExpect("Geolocation.Zip", "e");
    }

    [Fact]
    public void CountryTest()
    {
        Provider.SetupGet(p => p.Country).Returns("f");
        EvaluateAndExpect("Geolocation.Country", "f");
    }
}
