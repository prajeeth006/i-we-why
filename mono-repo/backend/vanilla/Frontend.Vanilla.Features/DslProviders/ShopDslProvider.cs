using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Shop;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="IShopDslProvider" /> for ASP.NET 4 apps.
/// </summary>
internal sealed class ShopDslProvider(Func<IPosApiCommonServiceInternal> posApiCommonServiceInternal, ICookieHandler cookieHandler)
    : IShopDslProvider
{
    private readonly Lazy<IPosApiCommonServiceInternal> posApiCommonServiceInternal = posApiCommonServiceInternal.ToLazy();

    public string ShopId => cookieHandler.GetValue(CookieConstants.ShopId) ?? string.Empty;

    public Task<string> GetBusinessUnitAsync(ExecutionMode mode)
        => GetShopDetailsAsync(mode, t => t?.BusinessUnit ?? string.Empty);

    public Task<string> GetRegionCodeAsync(ExecutionMode mode)
        => GetShopDetailsAsync(mode, t => t?.RegionCode ?? string.Empty);

    public Task<string> GetRegionAreaCodeAsync(ExecutionMode mode)
        => GetShopDetailsAsync(mode, t => t?.RegionAreaCode ?? string.Empty);

    public Task<string> GetSubRegionCodeAsync(ExecutionMode mode)
        => GetShopDetailsAsync(mode, t => t?.SubRegionCode ?? string.Empty);

    public Task<string> GetTimeZoneAsync(ExecutionMode mode)
        => GetShopDetailsAsync(mode, t => t?.TimeZone ?? string.Empty);

    public Task<string> GetLocaleAsync(ExecutionMode mode)
        => GetShopDetailsAsync(mode, t => t?.Locale ?? string.Empty);

    public Task<string> GetCurrencyCodeAsync(ExecutionMode mode)
        => GetShopDetailsAsync(mode, t => t?.CurrencyCode ?? string.Empty);

    public Task<string> GetCountryAsync(ExecutionMode mode)
        => GetShopDetailsAsync(mode, t => t?.Country ?? string.Empty);

    public Task<string> GetDefaultGatewayAsync(ExecutionMode mode)
        => GetShopDetailsAsync(mode, t => t?.DefaultGateway ?? string.Empty);

    public Task<decimal> GetShopTierAsync(ExecutionMode mode)
        => GetShopDetailsAsync(mode, t => t?.ShopTier ?? 0m);

    public Task<bool> GetValidatedAsync(ExecutionMode mode)
        => GetShopDetailsAsync(mode, t => t?.Validated ?? false);

    public Task<string> GetSitecoreShopGroupsAsync(ExecutionMode mode)
        => GetShopDetailsAsync(mode, t => t.SitecoreShopGroups.Join());

    private async Task<T> GetShopDetailsAsync<T>(ExecutionMode mode, Func<ShopDetailsResponse, T> getValue)
    {
        var shopDetails = ShopId.IsNullOrWhiteSpace() ? new ShopDetailsResponse() : await posApiCommonServiceInternal.Value.GetShopDetailsAsync(mode, ShopId);

        return getValue(shopDetails);
    }
}
