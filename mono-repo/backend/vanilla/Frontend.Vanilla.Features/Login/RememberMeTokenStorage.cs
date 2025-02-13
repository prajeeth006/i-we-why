using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Microsoft.Extensions.Caching.Distributed;

namespace Frontend.Vanilla.Features.Login;

/// <summary>
/// Temporary storage of remember-me token because login or workflow operation on any product app can receive it
/// but the cookie can be written only on configured app (usually www) at restricted path.
/// </summary>
internal interface IRememberMeTokenStorage
{
    Task<TrimmedRequiredString?> GetAsync(CancellationToken cancellationToken);
    Task SetAsync(TrimmedRequiredString value, CancellationToken cancellationToken);
    Task DeleteAsync(CancellationToken cancellationToken);
}

internal sealed class RememberMeTokenStorage(ILabelIsolatedDistributedCache distributedCache, ICurrentUserAccessor currentUserAccessor, IAuthenticationConfiguration authenticationConfiguration)
    : IRememberMeTokenStorage
{
    public async Task<TrimmedRequiredString?> GetAsync(CancellationToken cancellationToken)
    {
        var cacheKey = GetCacheKey();
        var bytes = await distributedCache.GetAsync(cacheKey, cancellationToken);

        return bytes != null ? new TrimmedRequiredString(bytes.DecodeToString()) : null;
    }

    public Task SetAsync(TrimmedRequiredString value, CancellationToken cancellationToken)
    {
        var cacheKey = GetCacheKey();
        var options = new DistributedCacheEntryOptions()
            .SetAbsoluteExpiration(authenticationConfiguration.Timeout); // TODO get from IAuthenticationConfiguration once merged to Vanilla
        var bytes = value.Value.EncodeToBytes();

        return distributedCache.SetAsync(cacheKey, bytes, options, cancellationToken);
    }

    public Task DeleteAsync(CancellationToken cancellationToken)
    {
        var cacheKey = GetCacheKey();

        return distributedCache.RemoveAsync(cacheKey, cancellationToken);
    }

    private string GetCacheKey()
    {
        var sessionToken = currentUserAccessor.User.FindValue(PosApiClaimTypes.SessionToken);

        if (string.IsNullOrWhiteSpace(sessionToken))
            throw new InvalidOperationException("User must be authenticated with PosAPI to handle his remember-me token.");

        return "LH:RememberMeToken:" + sessionToken;
    }
}
