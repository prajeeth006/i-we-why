using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Terminal;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="ITerminalDslProvider" /> for ASP.NET 4 apps.
/// </summary>
internal sealed class TerminalDslProvider(
    IPosApiCommonServiceInternal posApiCommonServiceInternal,
    ICookieHandler cookieHandler,
    ICurrentUserAccessor currentUserAccessor)
    : ITerminalDslProvider
{
    private string ShopId => cookieHandler.GetValue(CookieConstants.ShopId) ?? string.Empty;

    public string TerminalId => cookieHandler.GetValue(CookieConstants.TerminalId) ?? string.Empty;

    public Task<string> GetStatusAsync(ExecutionMode mode)
        => GetTerminalDetailsAsync(mode, t => t.Status ?? string.Empty);

    public Task<string> GetResolutionAsync(ExecutionMode mode)
        => GetTerminalDetailsAsync(mode, t => t.Data?.Resolution ?? string.Empty);

    public Task<string> GetIpAddressAsync(ExecutionMode mode)
        => GetTerminalDetailsAsync(mode, t => t.Data?.IpAddress ?? string.Empty);

    public Task<string> GetLockStatusAsync(ExecutionMode mode)
        => GetTerminalDetailsAsync(mode, t => t.Data?.LockStatus ?? string.Empty);

    public Task<string> GetMacIdAsync(ExecutionMode mode)
        => GetTerminalDetailsAsync(mode, t => t.Data?.MacId ?? string.Empty);

    public Task<string> GetTerminalStatusAsync(ExecutionMode mode)
        => GetTerminalDetailsAsync(mode, t => t.Data?.TerminalStatus ?? string.Empty);

    public Task<string> GetTypeAsync(ExecutionMode mode)
        => GetTerminalDetailsAsync(mode, t => t.Data?.TerminalType ?? string.Empty);

    public Task<string> GetVolumeAsync(ExecutionMode mode)
        => GetTerminalDetailsAsync(mode, t => t.Data?.Volume.ToString() ?? string.Empty);

    public Task<string> GetAccountNameAsync(ExecutionMode mode)
        => GetTerminalDetailsAsync(mode, t => t.Data?.CustomerAccount?.AccountName ?? string.Empty);

    public Task<string> GetCustomerIdAsync(ExecutionMode mode)
        => GetTerminalDetailsAsync(mode, t => t.Data?.CustomerAccount?.CustomerId ?? string.Empty);

    private async Task<T> GetTerminalDetailsAsync<T>(ExecutionMode mode, Func<TerminalDetailsResponse, T> getValue)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn() || ShopId.IsNullOrWhiteSpace() || TerminalId.IsNullOrWhiteSpace())
        {
            return getValue(new TerminalDetailsResponse());
        }

        var request = new TerminalDetailsRequest { ShopId = ShopId, TerminalId = TerminalId };
        var terminalDetails = await posApiCommonServiceInternal.GetTerminalDetailsAsync(mode, request);

        return getValue(terminalDetails);
    }
}
