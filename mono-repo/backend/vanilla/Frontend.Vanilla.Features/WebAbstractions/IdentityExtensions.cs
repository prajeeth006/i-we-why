using System.Security.Principal;

namespace Frontend.Vanilla.Features.WebAbstractions;

internal static class IdentityExtensions
{
    public static bool IsNotLoggedIn(this IIdentity? identity)
    {
        return identity is null || !identity.IsAuthenticated;
    }
}
