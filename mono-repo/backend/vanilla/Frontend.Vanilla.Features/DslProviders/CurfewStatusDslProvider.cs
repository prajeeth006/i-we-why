using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Wallet;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="ICurfewStatusDslProvider" /> for ASP.NET 4 apps.
/// </summary>
internal sealed class CurfewStatusDslProvider(
    ICurrentUserAccessor currentUserAccessor,
    IPosApiWalletServiceInternal posApiWalletService)
    : ICurfewStatusDslProvider
{
    public async Task<bool> GetIsDepositCurfewOnAsync(ExecutionMode mode)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
        {
            return false;
        }

        var curfewStatus = await posApiWalletService.GetCurfewStatusAsync(mode.AsyncCancellationToken ?? CancellationToken.None);

        return curfewStatus.IsDepositCurfewOn;
    }
}
