using System;
using System.Collections.Generic;

namespace Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Shop;

/// <summary>
/// Shop details response.
/// </summary>
public class ShopDetailsResponse
{
    /// <summary>
    /// Shop ID.
    /// </summary>
    public string ShopId { get; }

    /// <summary>
    /// Business unit.
    /// </summary>
    public string BusinessUnit { get; }

    /// <summary>
    /// Region code.
    /// </summary>
    public string RegionCode { get; }

    /// <summary>
    /// Region area code.
    /// </summary>
    public string RegionAreaCode { get; }

    /// <summary>
    /// Sub region code.
    /// </summary>
    public string SubRegionCode { get; }

    /// <summary>
    /// Time zone.
    /// </summary>
    public string TimeZone { get; }

    /// <summary>
    /// Locale.
    /// </summary>
    public string Locale { get; }

    /// <summary>
    /// Currency code.
    /// </summary>
    public string CurrencyCode { get; }

    /// <summary>
    /// Country.
    /// </summary>
    public string Country { get; }

    /// <summary>
    /// Default gateway.
    /// </summary>
    public string DefaultGateway { get; }

    /// <summary>
    /// Is validated.
    /// </summary>
    public bool Validated { get; }

    /// <summary>
    /// Shop tier.
    /// </summary>
    public int? ShopTier { get; }

    /// <summary>
    /// Sitecore shop groups.
    /// </summary>
    public IReadOnlyCollection<string> SitecoreShopGroups { get; }

    /// <summary>
    /// ShopDetailsResponse.
    /// </summary>
    public ShopDetailsResponse(
        string shopId = default,
        string businessUnit = default,
        string regionCode = default,
        string regionAreaCode = default,
        string subRegionCode = default,
        string timeZone = default,
        string locale = default,
        string currencyCode = default,
        string country = default,
        string defaultGateway = default,
        bool validated = default,
        int? shopTier = default,
        IReadOnlyCollection<string> sitecoreShopGroups = default)
    {
        ShopId = shopId;
        BusinessUnit = businessUnit;
        RegionCode = regionCode;
        RegionAreaCode = regionAreaCode;
        SubRegionCode = subRegionCode;
        TimeZone = timeZone;
        Locale = locale;
        CurrencyCode = currencyCode;
        Country = country;
        DefaultGateway = defaultGateway;
        Validated = validated;
        ShopTier = shopTier;
        SitecoreShopGroups = sitecoreShopGroups ?? Array.Empty<string>();
    }
}
