using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Shop;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.Inventory;

public class ShopDetailsTests
{
    [Theory]
    [MemberData(nameof(GetTestCases))]
    public void GetDataResultTests(object dto, ShopDetailsResponse expectedResponse)
    {
        var shopDetailsDto = dto as ShopDetailsDto;
        shopDetailsDto.Should().NotBeNull();

        var response = shopDetailsDto?.GetData();

        response?.ShopId.Should().Be(expectedResponse.ShopId);
        response?.ShopTier.Should().Be(expectedResponse.ShopTier);
        response?.RegionCode.Should().Be(expectedResponse.RegionCode);
        response?.BusinessUnit.Should().Be(expectedResponse.BusinessUnit);
        response?.RegionAreaCode.Should().Be(expectedResponse.RegionAreaCode);
        response?.SubRegionCode.Should().Be(expectedResponse.SubRegionCode);
        response?.TimeZone.Should().Be(expectedResponse.TimeZone);
        response?.Locale.Should().Be(expectedResponse.Locale);
        response?.CurrencyCode.Should().Be(expectedResponse.CurrencyCode);
        response?.Country.Should().Be(expectedResponse.Country);
        response?.CurrencyCode.Should().Be(expectedResponse.CurrencyCode);
        response?.DefaultGateway.Should().Be(expectedResponse.DefaultGateway);
        response?.Validated.Should().Be(expectedResponse.Validated);
    }

    public static IEnumerable<object[]> GetTestCases()
    {
        yield return GetTestCase(new ShopDetailsDto(), new ShopDetailsResponse());

        yield return GetTestCase(
            new ShopDetailsDto
            {
                ShopId = "1",
                ShopTier = 4,
                RegionCode = "Q",
                BusinessUnit = "W",
                RegionAreaCode = "E",
                SubRegionCode = "R",
                TimeZone = "T",
                Locale = "Y",
                CurrencyCode = "U",
                Country = "I",
                DefaultGateway = "O",
                Validated = true,
                SitecoreShopGroups = new[] { "SitecoreShopGroups" },
            },
            new ShopDetailsResponse(
                shopId: "1",
                shopTier: 4,
                regionCode: "Q",
                businessUnit: "W",
                regionAreaCode: "E",
                subRegionCode: "R",
                timeZone: "T",
                locale: "Y",
                currencyCode: "U",
                country: "I",
                defaultGateway: "O",
                validated: true,
                sitecoreShopGroups: new[] { "SitecoreShopGroups" }));
    }

    private static object[] GetTestCase(ShopDetailsDto dto, ShopDetailsResponse expectedResponse) => [dto, expectedResponse];
}
