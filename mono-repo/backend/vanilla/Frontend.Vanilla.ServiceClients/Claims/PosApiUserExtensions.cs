#nullable enable

using System;
using System.Security.Claims;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.ServiceClients.Claims;

/// <summary>
/// Extensions of <see cref="ClaimsPrincipal" /> for easier retrieval of claim values.
/// </summary>
public static class PosApiUserExtensions
{
    /// <summary>
    /// Determines if given user is real-money player based on his claim <see cref="PosApiClaimTypes.IsRealMoneyPlayer" />.
    /// Returns false for anonymous user. Throws if the claim value is invalid or missing for authenticated user.
    /// </summary>
    public static bool IsRealMoneyPlayer(this ClaimsPrincipal user)
        => ClaimsParser.Parse(user, PosApiClaimTypes.IsRealMoneyPlayer, bool.Parse, returnDefaultIfAnonymous: true);

    /// <summary>
    /// Gets <see cref="int" /> value of <see cref="PosApiClaimTypes.WorkflowTypeId" /> claim if it exists.
    /// Returns zero if claim doesn't exist. Throws if the claim value is invalid.
    /// </summary>
    public static int GetWorkflowTypeId(this ClaimsPrincipal user)
        => ClaimsParser.Parse(user, PosApiClaimTypes.WorkflowTypeId, int.Parse, returnDefaultIfNoClaim: true);

    /// <summary>
    /// Gets user's time zone according to his <see cref="PosApiClaimTypes.TimeZoneId" /> claim.
    /// Throws if the claim value is invalid or missing.
    /// </summary>
    public static TimeZoneInfo GetTimeZone(this ClaimsPrincipal user)
        => ClaimsParser.Parse(user, PosApiClaimTypes.TimeZoneId, TimeZoneInfo.FindSystemTimeZoneById);

    /// <summary>
    /// Converts given time into the user's time zone according to his <see cref="PosApiClaimTypes.TimeZoneId" /> claim.
    /// Throws if the claim value is invalid or missing or the conversion goes wrong.
    /// </summary>
    public static DateTimeOffset ToUserLocalTime(this UtcDateTime time, ClaimsPrincipal user)
    {
        var timeZone = user.GetTimeZone();

        return time.ConvertTo(timeZone);
    }
}
