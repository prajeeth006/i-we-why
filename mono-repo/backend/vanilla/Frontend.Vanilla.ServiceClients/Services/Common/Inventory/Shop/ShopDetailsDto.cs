using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Shop;

internal sealed class ShopDetailsDto : IPosApiResponse<ShopDetailsResponse>
{
    public string ShopId { get; set; }

    public string BusinessUnit { get; set; }

    public string RegionCode { get; set; }

    public string RegionAreaCode { get; set; }

    public string SubRegionCode { get; set; }

    public string TimeZone { get; set; }

    public string Locale { get; set; }

    public string CurrencyCode { get; set; }

    public string Country { get; set; }

    public string DefaultGateway { get; set; }

    public bool Validated { get; set; }

    public int? ShopTier { get; set; }

    public IReadOnlyCollection<string> SitecoreShopGroups { get; set; }

    public ShopDetailsResponse GetData() => new (
        shopId: ShopId,
        businessUnit: BusinessUnit,
        regionCode: RegionCode,
        regionAreaCode: RegionAreaCode,
        subRegionCode: SubRegionCode,
        timeZone: TimeZone,
        locale: Locale,
        currencyCode: CurrencyCode,
        country: Country,
        defaultGateway: DefaultGateway,
        validated: Validated,
        shopTier: ShopTier,
        sitecoreShopGroups: SitecoreShopGroups);
}
