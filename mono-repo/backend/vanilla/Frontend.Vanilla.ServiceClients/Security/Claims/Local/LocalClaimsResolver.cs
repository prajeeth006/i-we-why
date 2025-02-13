using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Security.Claims.Local;

/// <summary>
/// Resolves all local claims from <see cref="ILocalClaimsProvider" />-s.
/// There are also PosAPI claims, see <see cref="IPosApiClaimsServiceClient" />.
/// </summary>
internal interface ILocalClaimsResolver
{
    /// <param name="existingClaims">Claims from PosAPI or from other product app within the label.</param>
    /// <param name="mode"></param>
    Task<IReadOnlyList<Claim>> ResolveAsync([NotNull] IEnumerable<Claim> existingClaims, ExecutionMode mode);
}

internal sealed class LocalClaimsResolver(ILocalClaimsProviders providers, ICurrentUserAccessor currentUserAccessor, IClaimsUserFactory claimsUserFactory)
    : ILocalClaimsResolver
{
    public async Task<IReadOnlyList<Claim>> ResolveAsync(IEnumerable<Claim> existingClaims, ExecutionMode mode)
    {
        existingClaims = Guard.NotEmptyNorNullItems(EnumerableExtensions.Enumerate(existingClaims), nameof(existingClaims));

        // User could have navigated between product apps within the label -> claims from common providers already exist -> filter providers out
        var existingIssuers = existingClaims.Select(c => c.Issuer).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var providersToExecute = providers.Providers.Where(p => !existingIssuers.Contains(p.Issuer)).ToList();

        if (providersToExecute.Count == 0)
            return Array.Empty<Claim>();

        // Set temporary user so that Vanilla consumers can use generic PosAPI infrastructure in claims providers
        currentUserAccessor.User = claimsUserFactory.Create(existingClaims);

        var allClaims = Enumerable.ToDictionary(existingClaims, c => c.Type, StringComparer.OrdinalIgnoreCase);
        var result = new List<Claim>(2 * providersToExecute.Count);

        foreach (var provider in providersToExecute)
        foreach (var claim in await provider.GetClaimsAsync(mode))
        {
            if (allClaims.TryGetValue(claim.Type, out var conflict))
                throw new Exception(
                    $"LocalClaimsProvider {provider} with Issuer '{provider.Issuer}' issued claim '{claim.Type}' with value '{claim.Value}'"
                    + $" which already exists with value '{conflict.Value}' issued by '{conflict.Issuer}'.");

            // Don't allow local claims providers to overwrite or duplicate each other
            allClaims.Add(claim.Type, claim);
            result.Add(claim);
        }

        return result;
    }
}
