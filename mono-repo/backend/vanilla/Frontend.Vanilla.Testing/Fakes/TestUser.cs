using System.Collections.Generic;
using System.Security.Claims;
using Frontend.Vanilla.ServiceClients.Claims;

namespace Frontend.Vanilla.Testing.Fakes;

/// <summary>
/// auth state.
/// </summary>
public enum AuthState
{
    /// <summary>
    /// anonymous.
    /// </summary>
    Anonymous,

    /// <summary>
    /// authenticated.
    /// </summary>
    Authenticated,

    /// <summary>
    /// workflow.
    /// </summary>
    Workflow,
}

internal static class TestUser
{
    public static readonly IReadOnlyList<AuthState> AnonymousOrWorkflow = new[] { AuthState.Anonymous, AuthState.Workflow };
    public static readonly IReadOnlyList<AuthState> AuthenticatedOrWorkflow = new[] { AuthState.Authenticated, AuthState.Workflow };

    public static ClaimsPrincipal Get(AuthState authState = AuthState.Anonymous)
    {
        var identity = new ClaimsIdentity(authState == AuthState.Authenticated ? "Vanilla" : null);
        identity.AddClaim(new Claim(PosApiClaimTypes.TimeZoneId, "Ekaterinburg Standard Time"));

        if (authState != AuthState.Anonymous)
        {
            identity.AddClaim(new Claim(PosApiClaimTypes.UserToken, "user-token"));
            identity.AddClaim(new Claim(PosApiClaimTypes.SessionToken, "session-token"));
        }

        return new ClaimsPrincipal(identity);
    }
}
