using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;

namespace Frontend.Vanilla.Features.DslProviders;

internal interface IBalanceDslExecutor
{
    Task<decimal> GetAsync(ExecutionMode mode, Func<Balance, decimal> getProperty);
}

internal sealed class BalanceDslExecutor(ICurrentUserAccessor currentUserAccessor, IPosApiWalletServiceInternal posApiWalletService)
    : IBalanceDslExecutor
{
    public const decimal AnonymousValue = -1;

    public async Task<decimal> GetAsync(ExecutionMode mode, Func<Balance, decimal> getProperty)
    {
        if (!currentUserAccessor.User.Identity?.IsAuthenticated is true)
            return AnonymousValue;

        var balance = await posApiWalletService.GetBalanceAsync(mode);

        return getProperty(balance);
    }
}
