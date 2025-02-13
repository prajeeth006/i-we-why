#nullable enable

using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Security.Claims;
using Frontend.Vanilla.ServiceClients.Services.Authentication.ValidateTokens;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication;

/// <summary>
/// Loads last/fresh claims user corresponding to the given/current auth tokens and sets them to current thread.
/// </summary>
internal interface IClaimsServiceClient
{
    Task<ClaimsPrincipal> SetupAnonymousUserAsync(ExecutionMode mode);
    Task<ClaimsPrincipal> SetupUserAsync(ExecutionMode mode, PosApiAuthTokens authTokens, bool validateAuthOnPosApi);
    Task ReloadAsync(ExecutionMode mode);
}

internal sealed class ClaimsServiceClient(
    IClaimsCache claimsCache,
    IPosApiClaimsServiceClient posApiClaimsServiceClient,
    IClaimsUserManager claimsUserManager,
    IValidateTokensServiceClient validateTokensServiceClient)
    : IClaimsServiceClient
{
    public Task<ClaimsPrincipal> SetupAnonymousUserAsync(ExecutionMode mode)
        => SetupUserAsync(mode, null, false);

    public async Task<ClaimsPrincipal> SetupUserAsync(ExecutionMode mode, PosApiAuthTokens? authTokens, bool validateAuthOnPosApi)
    {
        try
        {
            var cachedClaims = await claimsCache.GetAsync(mode, authTokens);

            if (cachedClaims != null)
            {
                if (authTokens != null && validateAuthOnPosApi)
                    await validateTokensServiceClient.ValidateAsync(mode, authTokens);

                return await claimsUserManager.SetCurrentAsync(mode, cachedClaims, writeClaimsToCache: false);
            }

            return await LoadAsync(mode, authTokens, cached: true); // Automatically validates auth on PosAPI
        }
        catch (Exception ex)
        {
            throw new PosApiException($"Failed setting up claims for user {authTokens.ToDebugString()}.", ex);
        }
    }

    public async Task ReloadAsync(ExecutionMode mode)
    {
        var authTokens = claimsUserManager.Current.GetPosApiAuthTokens();

        try
        {
            await LoadAsync(mode, authTokens, cached: false);
        }
        catch (Exception ex)
        {
            throw new PosApiException($"Failed reloading claims for user {authTokens.ToDebugString()}.", ex);
        }
    }

    private async Task<ClaimsPrincipal> LoadAsync(ExecutionMode mode, PosApiAuthTokens? authTokens, bool cached)
    {
        var posApiClaims = await posApiClaimsServiceClient.GetAsync(mode, authTokens, cached);

        return await claimsUserManager.SetCurrentAsync(mode, posApiClaims, writeClaimsToCache: true);
    }
}
