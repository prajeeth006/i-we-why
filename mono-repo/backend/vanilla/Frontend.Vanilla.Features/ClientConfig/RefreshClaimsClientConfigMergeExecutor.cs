using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.ClientConfig;

/// <summary>
/// Refreshes user claims if needed before any provider is executed b/c more of them use claims so it's unclear which should refresh them.
/// </summary>
internal sealed class RefreshClaimsClientConfigMergeExecutor(
    IClientConfigMergeExecutor inner,
    ICachedUserValuesFlag cachedUserValuesFlag,
    IPosApiAuthenticationService posApiAuthenticationService,
    IHttpContextAccessor contextAccessor)
    : IClientConfigMergeExecutor
{
    public async Task<IReadOnlyDictionary<string, object>> ExecuteAsync(IEnumerable<IClientConfigProvider> providers, CancellationToken cancellationToken)
    {
        var cached = await cachedUserValuesFlag.GetCached(cancellationToken);

        return cached ? await inner.ExecuteAsync(providers, cancellationToken) : await ExecuteWithRefreshAsync(providers, cancellationToken);
    }

    private async Task<IReadOnlyDictionary<string, object>> ExecuteWithRefreshAsync(IEnumerable<IClientConfigProvider> providers, CancellationToken cancellationToken)
    {
        var clientConfigProviders = providers.ToList();
        var isPostLogin = contextAccessor.GetRequiredHttpContext().Request.Headers.GetValue(HttpHeaders.XReloadOnLogin).ToString() == "1";
        var shouldRefreshClaims = !isPostLogin && clientConfigProviders.Any(p => p.Type == ClientConfigType.Eager);

        // Refresh PPOS claims only when loading Eager client config, because on page load eager client configs are first executed, so we don't need to execute it for partial configs
        // Assume that main issue is, user deposits on cashier and goes back to product and sees old balance.
        // After the login vnClaims, vnUser are first executed and we don't need to refresh the claims, they should be up-to-date
        if (shouldRefreshClaims)
        {
            await posApiAuthenticationService.RefreshClaimsAsync(cancellationToken);
        }

        return await inner.ExecuteAsync(providers, cancellationToken);
    }
}
