using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides access to retail's shop info.
/// </summary>
[Description("Provides access to retail's shop info.")]
[ValueVolatility(ValueVolatility.Client)]
public interface IShopDslProvider
{
    /// <summary>
    /// Indicates shop ID.
    /// </summary>
    [Description("Indicates shop ID.")]
    string ShopId { get; }

    /// <summary>
    /// Gets business unit.
    /// </summary>
    [Description("Gets business unit.")]
    Task<string> GetBusinessUnitAsync(ExecutionMode mode);

    /// <summary>
    /// Gets region code.
    /// </summary>
    [Description("Gets region code.")]
    Task<string> GetRegionCodeAsync(ExecutionMode mode);

    /// <summary>
    /// Gets region area code.
    /// </summary>
    [Description("Gets region area code.")]
    Task<string> GetRegionAreaCodeAsync(ExecutionMode mode);

    /// <summary>
    /// Gets sub-region code.
    /// </summary>
    [Description("Gets sub region code.")]
    Task<string> GetSubRegionCodeAsync(ExecutionMode mode);

    /// <summary>
    /// Gets time zone.
    /// </summary>
    [Description("Gets time zone.")]
    Task<string> GetTimeZoneAsync(ExecutionMode mode);

    /// <summary>
    /// Gets locale.
    /// </summary>
    [Description("Gets locale.")]
    Task<string> GetLocaleAsync(ExecutionMode mode);

    /// <summary>
    /// Gets currency code.
    /// </summary>
    [Description("Gets currency code.")]
    Task<string> GetCurrencyCodeAsync(ExecutionMode mode);

    /// <summary>
    /// Gets country.
    /// </summary>
    [Description("Gets country.")]
    Task<string> GetCountryAsync(ExecutionMode mode);

    /// <summary>
    /// Gets default gateway.
    /// </summary>
    [Description("Gets default gateway.")]
    Task<string> GetDefaultGatewayAsync(ExecutionMode mode);

    /// <summary>
    /// Gets the shop tier.
    /// </summary>
    [Description("Gets the shop tier.")]
    Task<decimal> GetShopTierAsync(ExecutionMode mode);

    /// <summary>
    /// Gets is validated.
    /// </summary>
    [Description("Gets validated.")]
    Task<bool> GetValidatedAsync(ExecutionMode mode);

    /// <summary>
    /// Gets Sitecore shop groups.
    /// </summary>
    [Description("Gets Sitecore shop groups.")]
    Task<string> GetSitecoreShopGroupsAsync(ExecutionMode mode);
}
