#nullable enable

using System.Linq;
using System.Security.Claims;

namespace Frontend.Vanilla.Testing;

internal static class UserExtensions
{
    public static void SetOrRemoveClaim(this ClaimsPrincipal user, string type, string? value)
    {
        user.RemoveClaim(type);

        if (value != null)
            user.AddClaim(type, value);
    }

    public static void AddClaim(this ClaimsPrincipal user, string type, string value)
        => user.GetClaimsIdentity().AddClaim(new Claim(type, value));

    public static void RemoveClaim(this ClaimsPrincipal user, string type)
    {
        var identity = user.GetClaimsIdentity();
        var toRemove = identity.Claims.Where(c => c.Type == type).ToList();
        toRemove.ForEach(identity.RemoveClaim);
    }

    private static ClaimsIdentity GetClaimsIdentity(this ClaimsPrincipal user)
    {
        if (!(user.Identity is ClaimsIdentity identity))
            user.AddIdentity(identity = new ClaimsIdentity());

        return identity;
    }
}
