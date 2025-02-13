using System;
using System.Security.Claims;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.ServiceClients.Claims;

/// <summary>
/// Generic class for parsing user claim values.
/// </summary>
internal static class ClaimsParser
{
    public static T Parse<T>(
        ClaimsPrincipal user,
        string claimType,
        Func<string, T> parseValue,
        bool returnDefaultIfAnonymous = false,
        bool returnDefaultIfNoClaim = false)
    {
        Guard.NotNull(user, nameof(user));
        Guard.NotNull(user.Identity, nameof(user.Identity));

        if (returnDefaultIfAnonymous && !user.Identity.IsAuthenticated)
            return default;

        var claim = user.FindFirst(claimType);

        if (returnDefaultIfNoClaim && claim == null)
            return default;

        try
        {
            if (claim == null) throw new Exception("The claim doesn't exist.");
            if (string.IsNullOrWhiteSpace(claim.Value)) throw new Exception("The claim value can't be null nor white-space.");

            return parseValue(claim.Value);
        }
        catch (Exception ex)
        {
            throw new InvalidClaimException($"Failed parsing claim {claimType} which is {(claim?.Value).Dump()} for {MessageUtil.Format(user)}.", ex);
        }
    }
}

internal sealed class InvalidClaimException(string message = null, Exception innerException = null) : Exception(message, innerException) { }
