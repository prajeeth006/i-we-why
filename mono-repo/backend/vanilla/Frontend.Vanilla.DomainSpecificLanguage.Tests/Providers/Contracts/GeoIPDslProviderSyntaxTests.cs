using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class GeoIPDslProviderSyntaxTests : SyntaxTestBase<IGeoIPDslProvider>
{
    [Fact]
    public void CountryTest()
    {
        Provider.Setup(p => p.GetCountry()).Returns("AT");
        EvaluateAndExpect("GeoIP.Country", "AT");
    }

    [Fact]
    public void CountryNameTest()
    {
        Provider.Setup(p => p.GetCountryName()).Returns("Austria");
        EvaluateAndExpect("GeoIP.CountryName", "Austria");
    }

    [Fact]
    public void RegionTest()
    {
        Provider.Setup(p => p.GetRegion()).Returns("Austria");
        EvaluateAndExpect("GeoIP.Region", "Austria");
    }

    [Fact]
    public void CityTest()
    {
        Provider.Setup(p => p.GetCity()).Returns("Vienna");
        EvaluateAndExpect("GeoIP.City", "Vienna");
    }
}
