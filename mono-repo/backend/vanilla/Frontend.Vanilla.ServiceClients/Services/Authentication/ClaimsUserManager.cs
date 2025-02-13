#nullable enable

using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Security.Claims;
using Frontend.Vanilla.ServiceClients.Security.Claims.Local;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication;

/// <summary>
/// Sets current claims user with all associated logic.
/// </summary>
internal interface IClaimsUserManager
{
    ClaimsPrincipal Current { get; }
    Task<ClaimsPrincipal> SetCurrentAsync(ExecutionMode mode, IEnumerable<Claim> existingClaims, bool writeClaimsToCache);
}

internal sealed class ClaimsUserManager(
    ICurrentUserAccessor currentUserAccessor,
    IClaimsUserFactory claimsUserFactory,
    ILocalClaimsResolver localClaimsResolver,
    IClaimsCache claimsCache)
    : IClaimsUserManager
{
    public ClaimsPrincipal Current => currentUserAccessor.User;

    public async Task<ClaimsPrincipal> SetCurrentAsync(ExecutionMode mode, IEnumerable<Claim> existingClaims, bool writeClaimsToCache)
    {
        existingClaims = existingClaims.Enumerate();
        var localClaims = await localClaimsResolver.ResolveAsync(existingClaims, mode);
        var allClaims = existingClaims.Concat(localClaims).ToList();
        var user = claimsUserFactory.Create(allClaims);

        currentUserAccessor.User = user;

        // User could have navigated between product apps within the label -> new local claims -> force write to cache
        if (writeClaimsToCache || localClaims.Count > 0)
            await claimsCache.SetAsync(mode, allClaims);

        return user;
    }
}
