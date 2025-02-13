using System;
using System.Linq;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.ServiceClients.Security;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class ClaimsDslProvider(ICurrentUserAccessor currentUserAccessor) : IClaimsDslProvider
{
    public string? Get(string claimType)
    {
        var isAbsoluteClaimType = Uri.TryCreate(claimType, UriKind.Absolute, out _);

        var claim = isAbsoluteClaimType
            ? currentUserAccessor.User.FindFirst(claimType)
            : currentUserAccessor.User.Claims.FirstOrDefault(c => c.Type.EndsWith("/" + claimType, StringComparison.OrdinalIgnoreCase));

        return claim?.Value;
    }
}
