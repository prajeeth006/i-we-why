using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.ServiceClients.Security.Claims.Local;

/// <summary>
/// Resolves and validates all <see cref="LocalClaimsProvider" /> registered in this app.
/// </summary>
internal interface ILocalClaimsProviders
{
    IReadOnlyList<ILocalClaimsProvider> Providers { get; }
}

internal sealed class LocalClaimsProviders : ILocalClaimsProviders
{
    public IReadOnlyList<ILocalClaimsProvider> Providers { get; }

    public LocalClaimsProviders(IEnumerable<ILocalClaimsProvider> providers, IGlobalClaimInfos globalClaimInfos)
    {
        Providers = providers.ToList();

        Providers.CheckNoDuplicatesBy(p => p.Issuer, RequiredStringComparer.OrdinalIgnoreCase);

        var claimsBySource = Providers.SelectMany(p => p.DeclaredClaims.Select(i => (i.Type, Source: $"LocalClaimsProvider {p} with Issuer '{p.Issuer}'")))
            .Concat(globalClaimInfos.Infos.Select(i => (i.Type, Source: $"global issuer '{i.Issuer}'")));

        if (claimsBySource.TryFindDuplicateBy(x => x.Type, out var conflict, RequiredStringComparer.OrdinalIgnoreCase))
            throw new Exception($"There can be only one source for a claim but '{conflict.Key}' is issued by: {conflict.Select(x => x.Source).Join(" vs. ")}.");
    }
}
