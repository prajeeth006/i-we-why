using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Shop;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public sealed class ShopDslProviderTests
{
    private readonly IShopDslProvider target;
    private readonly Mock<ICookieHandler> cookieHandlerMock;
    private readonly Mock<IPosApiCommonServiceInternal> posApiCommonServiceInternalMock;
    private readonly ExecutionMode mode;
    private readonly ShopDetailsResponse response;

    public ShopDslProviderTests()
    {
        mode = TestExecutionMode.Get();
        response = new ShopDetailsResponse(
            "ShopId",
            "BusinessUnit",
            "RegionCode",
            "RegionAreaCode",
            "SubRegionCode",
            "TimeZone",
            "Locale",
            "CurrencyCode",
            "Country",
            "DefaultGateway",
            true,
            99,
            new[] { "SitecoreShopGroups" });

        posApiCommonServiceInternalMock = new Mock<IPosApiCommonServiceInternal>();
        posApiCommonServiceInternalMock.Setup(s => s.GetShopDetailsAsync(mode, It.IsAny<string>(), It.IsAny<bool>()))
            .ReturnsAsync(response);

        cookieHandlerMock = new Mock<ICookieHandler>();
        cookieHandlerMock.Setup(x => x.GetValue(It.IsAny<string>())).Returns("123");

        target = new ShopDslProvider(() => posApiCommonServiceInternalMock.Object, cookieHandlerMock.Object);
    }

    [Fact]
    public void ShopId_ShouldHaveCorrectValue()
    {
        // Setup
        cookieHandlerMock.Setup(o => o.GetValue(CookieConstants.ShopId)).Returns("2");

        // Assert
        target.ShopId.Should().Be("2");
    }

    [Fact]
    public async Task GeShopTierAsync_ShouldHaveCorrectValue() => (await target.GetShopTierAsync(mode)).Should().Be(response.ShopTier);

    [Fact]
    public async Task GetBusinessUnitAsync_ShouldHaveCorrectValue() => (await target.GetBusinessUnitAsync(mode)).Should().Be(response.BusinessUnit);

    [Fact]
    public async Task GetCountryAsync_ShouldHaveCorrectValue() => (await target.GetCountryAsync(mode)).Should().Be(response.Country);

    [Fact]
    public async Task GetCurrencyCodeAsync_ShouldHaveCorrectValue() => (await target.GetCurrencyCodeAsync(mode)).Should().Be(response.CurrencyCode);

    [Fact]
    public async Task GetDefaultGatewayAsync_ShouldHaveCorrectValue() => (await target.GetDefaultGatewayAsync(mode)).Should().Be(response.DefaultGateway);

    [Fact]
    public async Task GetLocaleAsync_ShouldHaveCorrectValue() => (await target.GetLocaleAsync(mode)).Should().Be(response.Locale);

    [Fact]
    public async Task GetRegionAreaCodeAsync_ShouldHaveCorrectValue() => (await target.GetRegionAreaCodeAsync(mode)).Should().Be(response.RegionAreaCode);

    [Fact]
    public async Task GetRegionCodeAsync_ShouldHaveCorrectValue() => (await target.GetRegionCodeAsync(mode)).Should().Be(response.RegionCode);

    [Fact]
    public async Task GetSitecoreShopGroupsAsync_ShouldHaveCorrectValue() =>
        (await target.GetSitecoreShopGroupsAsync(mode)).Should().Be(response.SitecoreShopGroups.Join());

    [Fact]
    public async Task GetSubRegionCodeAsync_ShouldHaveCorrectValue() => (await target.GetSubRegionCodeAsync(mode)).Should().Be(response.SubRegionCode);

    [Fact]
    public async Task GetTimeZoneAsync_ShouldHaveCorrectValue() => (await target.GetTimeZoneAsync(mode)).Should().Be(response.TimeZone);

    [Fact]
    public async Task GetValidatedAsync_ShouldHaveCorrectValue() => (await target.GetValidatedAsync(mode)).Should().Be(response.Validated);
}
