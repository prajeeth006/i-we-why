#nullable enable

using System.Security.Claims;

namespace Frontend.Vanilla.ServiceClients.Claims;

/// <summary>
/// Generic extensions methods of <see cref="ClaimsPrincipal" /> user.
/// </summary>
public static class GenericUserExtensions
{
    /// <summary>Retrieves the value of the first claim with the specified claim type. Returns null if claim is not found.</summary>
    public static string? FindValue(this ClaimsPrincipal user, string claimType)
        => user.FindFirst(claimType)?.Value;
}
