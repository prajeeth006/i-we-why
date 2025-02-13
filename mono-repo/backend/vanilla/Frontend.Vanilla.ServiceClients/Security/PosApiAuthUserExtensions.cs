#nullable enable

using System;
using System.Security.Claims;
using System.Security.Principal;
using Frontend.Vanilla.ServiceClients.Claims;

namespace Frontend.Vanilla.ServiceClients.Security;

/// <summary>
/// Extensions for obtaining user's <see cref="PosApiAuthTokens" />.
/// </summary>
internal static class PosApiAuthUserExtensions
{
    /// <summary>Gets PosAPI auth tokens of given user if he is authenticated. Otherwsise returns null.</summary>
    public static PosApiAuthTokens? GetPosApiAuthTokens(this ClaimsPrincipal user)
    {
        try
        {
            var userToken = user.FindValue(PosApiClaimTypes.UserToken);
            var sessionToken = user.FindValue(PosApiClaimTypes.SessionToken);

            return PosApiAuthTokens.TryCreate(userToken, sessionToken);
        }
        catch (Exception ex)
        {
            throw new NotAuthenticatedWithPosApiException($"Failed to determine PosAPI tokens for the user {GetUserInfo(user)}.", ex);
        }
    }

    /// <summary>Gets PosAPI auth tokens of given user if he is authenticated. Otherwise throws an exception.</summary>
    public static PosApiAuthTokens GetRequiredPosApiAuthTokens(this ClaimsPrincipal user)
    {
        var tokens = user.GetPosApiAuthTokens();

        return tokens ?? throw new NotAuthenticatedWithPosApiException("User must be authenticated with PosAPI hence have user and session token claims but he doesn't."
                                                                       + $" Either don't call particular operation or this is erroneous state. User: {GetUserInfo(user)}.");
    }

    /// <summary>
    /// Determines if given user is authenticated with PosAPI which means he is either fully authenticated or has a workflow to complete.
    /// </summary>
    public static bool IsAuthenticatedOrHasWorkflow(this ClaimsPrincipal user)
        => user.GetPosApiAuthTokens() != null;

    /// <summary>
    /// Determines if given user is anonymous user i.e. bet-station user.
    /// </summary>
    public static bool IsAnonymous(this ClaimsPrincipal user)
        => user.FindValue(PosApiClaimTypes.JurisdictionId) == "ANO" && user.FindValue(PosApiClaimTypes.AccBusinessPhase) == "anonymous";

    private static string GetUserInfo(IPrincipal user)
        => $"{user.GetType()} IsAuthenticated={user.Identity?.IsAuthenticated}, Name='{user.Identity?.Name}', AuthenticationType='{user.Identity?.AuthenticationType}'";
}
