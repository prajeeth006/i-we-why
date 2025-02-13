using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Security.Claims.Local;

// Class is exposed instead of this interface in order to enforce strict checks to be executed also in consumers code especially unit tests.
internal interface ILocalClaimsProvider
{
    TrimmedRequiredString Issuer { get; }
    IReadOnlyList<LocalClaimInfo> DeclaredClaims { get; }
    Task<IReadOnlyList<Claim>> GetClaimsAsync(ExecutionMode mode);
}

/// <summary>
/// Extensibility point to allow users of the framework to add custom claim providers which add claims specific to their application.
/// </summary>
public abstract class LocalClaimsProvider : ILocalClaimsProvider
{
    /// <summary>
    /// Gets the name used in <see cref="Claim.Issuer" /> to identity this provider.
    /// </summary>
    public TrimmedRequiredString Issuer { get; }

    /// <summary>
    /// Gets information about claims issued by this provider.
    /// </summary>
    public IReadOnlyList<LocalClaimInfo> DeclaredClaims { get; }

    /// <summary>
    /// Creates a new instance.
    /// </summary>
    protected LocalClaimsProvider([NotNull] TrimmedRequiredString issuer, [NotNull, ItemNotNull] IEnumerable<LocalClaimInfo> declaredClaims)
    {
        Issuer = Guard.NotNull(issuer, nameof(issuer));
        DeclaredClaims = Guard.NotEmptyNorNullItems(declaredClaims?.ToList(), nameof(declaredClaims));

        DeclaredClaims.CheckNoDuplicatesBy(i => i.Type, RequiredStringComparer.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Issue claims.
    /// </summary>
    public async Task<IReadOnlyList<Claim>> GetClaimsAsync(ExecutionMode mode)
    {
        var claims = new Dictionary<string, Claim>(DeclaredClaims.Count, StringComparer.OrdinalIgnoreCase);

        // ReSharper disable once ConstantNullCoalescingCondition we don't trust Vanilla consumers :-P
        foreach (var claim in await ResolveClaimsAsync(mode) ?? throw new Exception($"LocalClaimsProvider {this} with Issuer='{Issuer}' returned null enumerable."))
            try
            {
                // ReSharper disable once HeuristicUnreachableCode, ConditionIsAlwaysTrueOrFalse we don't trust Vanilla consumers :-P
                if (claim == null)
                    throw new Exception("Returned claim is null.");

                if (!DeclaredClaims.Any(i => i.Type.Value.Equals(claim.Type)))
                    throw new Exception(
                        $"Provider isn't allowed to issue this claim type because it's missing in DeclaredClaims: {DeclaredClaims.Select(c => $"'{c.Type}'").Join()}.");

                if (claim.Issuer != Issuer)
                    throw new Exception($"Issuer '{claim.Issuer}' must correspond to one of the provider.");

                if (claims.TryGetValue(claim.Type, out var alreadyIssued))
                    throw new Exception($"Claim was issued multiple times with values '{alreadyIssued.Value}' vs. '{claim.Value}'.");

                claims.Add(claim.Type, claim);
            }
            catch (Exception ex)
            {
                throw new Exception($"LocalClaimsProvider {this} with Issuer='{Issuer}' issued invalid claim '{claim?.Type}'.", ex);
            }

        return claims.Values.ToList();
    }

    /// <summary>
    /// Issue claims.
    /// </summary>
    [NotNull, ItemNotNull]
    protected virtual IReadOnlyList<Claim> ResolveClaims()
        => throw new NotImplementedException("ResolveClaims or ResolveClainsAsync must be overriden. Please add the implementation needed for your application.");

    /// <summary>
    /// Issue claims.
    /// </summary>
    [NotNull, ItemNotNull]
    protected virtual Task<IReadOnlyList<Claim>> ResolveClaimsAsync(ExecutionMode mode)
        => Task.FromResult(ResolveClaims());
}
