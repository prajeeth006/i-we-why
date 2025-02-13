using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Wallet;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="ITourneyTokenBalanceDslProvider" />.
/// </summary>
internal sealed class TourneyTokenBalanceDslProvider(ICurrentUserAccessor currentUserAccessor, IPosApiWalletServiceInternal posApiWalletService)
    : ITourneyTokenBalanceDslProvider
{
    public const decimal AnonymousValue = -1;

    public async Task<decimal> GetBalanceAsync(ExecutionMode mode)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
        {
            return AnonymousValue;
        }

        var tourneyToken = await posApiWalletService.GetTourneyTokenBalance(mode);

        return tourneyToken.TourneyTokenBalance;
    }

    public async Task<string> GetCurrencyAsync(ExecutionMode mode)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
        {
            return "";
        }

        var tourneyToken = await posApiWalletService.GetTourneyTokenBalance(mode);

        return tourneyToken.TourneyTokenCurrencyCode ?? "";
    }
}
