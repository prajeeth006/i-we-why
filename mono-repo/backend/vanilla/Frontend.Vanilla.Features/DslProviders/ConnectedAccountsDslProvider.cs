using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="IConnectedAccountsDslProvider" /> for ASP.NET 4 apps.
/// </summary>
internal sealed class ConnectedAccountsDslProvider(
    ICurrentUserAccessor currentUserAccessor,
    IPosApiAccountServiceInternal posApiAccountService)
    : IConnectedAccountsDslProvider
{
    public async Task<decimal> GetCountAsync(ExecutionMode mode)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
        {
            return 0;
        }

        var accounts =
            await posApiAccountService.GetConnectedAccountsAsync(mode.AsyncCancellationToken ?? CancellationToken.None);

        // Decreased count for one because PPOS endpoint is returning current account as connected one.
        return accounts.Count(a => a.HasAccount) - 1;
    }
}
