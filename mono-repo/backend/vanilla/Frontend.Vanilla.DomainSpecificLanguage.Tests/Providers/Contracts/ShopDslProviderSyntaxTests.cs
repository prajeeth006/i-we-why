using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class ShopDslProviderSyntaxTests : SyntaxTestBase<IShopDslProvider>
{
    [Fact]
    public void ShopIdTest()
    {
        Provider.SetupGet(p => p.ShopId).Returns("1");
        EvaluateAndExpect("Shop.ShopId", "1");
    }

    [Fact]
    public void CountryTest()
    {
        Provider.Setup(p => p.GetCountryAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Shop.Country", "1");
    }

    [Fact]
    public void LocaleTest()
    {
        Provider.Setup(p => p.GetLocaleAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Shop.Locale", "1");
    }

    [Fact]
    public void ValidatedTest()
    {
        Provider.Setup(p => p.GetValidatedAsync(Mode)).ReturnsAsync(true);
        EvaluateAndExpect("Shop.Validated", true);
    }

    [Fact]
    public void BusinessUnitTest()
    {
        Provider.Setup(p => p.GetBusinessUnitAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Shop.BusinessUnit", "1");
    }

    [Fact]
    public void CurrencyCodeTest()
    {
        Provider.Setup(p => p.GetCurrencyCodeAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Shop.CurrencyCode", "1");
    }

    [Fact]
    public void DefaultGatewayTest()
    {
        Provider.Setup(p => p.GetDefaultGatewayAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Shop.DefaultGateway", "1");
    }

    [Fact]
    public void ShopTierTest()
    {
        Provider.Setup(p => p.GetShopTierAsync(Mode)).ReturnsAsync(1m);
        EvaluateAndExpect("Shop.ShopTier", 1m);
    }

    [Fact]
    public void RegionCodeTest()
    {
        Provider.Setup(p => p.GetRegionCodeAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Shop.RegionCode", "1");
    }

    [Fact]
    public void TimeZoneTest()
    {
        Provider.Setup(p => p.GetTimeZoneAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Shop.TimeZone", "1");
    }

    [Fact]
    public void RegionAreaCodeTest()
    {
        Provider.Setup(p => p.GetRegionAreaCodeAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Shop.RegionAreaCode", "1");
    }

    [Fact]
    public void SubRegionCodeTest()
    {
        Provider.Setup(p => p.GetSubRegionCodeAsync(Mode)).ReturnsAsync("1");
        EvaluateAndExpect("Shop.SubRegionCode", "1");
    }
}
