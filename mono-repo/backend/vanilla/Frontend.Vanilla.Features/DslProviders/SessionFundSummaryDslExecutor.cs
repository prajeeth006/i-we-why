using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Frontend.Vanilla.ServiceClients.Services.Wallet.UserSessionFundSummary;

namespace Frontend.Vanilla.Features.DslProviders;

internal interface ISessionFundSummaryDslExecutor
{
    Task<decimal> GetAsync(ExecutionMode mode, Func<SessionFundSummary, decimal> getProperty);
}

internal sealed class SessionFundSummaryDslExecutor(ICurrentUserAccessor currentUserAccessor, IPosApiWalletServiceInternal posApiWalletService)
    : ISessionFundSummaryDslExecutor
{
    public const decimal AnonymousValue = -1;

    public async Task<decimal> GetAsync(ExecutionMode mode, Func<SessionFundSummary, decimal> getProperty)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
            return AnonymousValue;

        var fundSummary = await posApiWalletService.GetSessionFundSummary(mode);

        return getProperty(fundSummary);
    }
}
