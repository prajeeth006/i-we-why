using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.Login;

/// <summary>
/// Same as <see cref="LoginParameters" /> with additional oauth ID parameters.
/// </summary>
internal sealed class OAuthIdLoginParameters : OptionalUsernameLoginParameters
{
    /// <summary>Creates a new instance.</summary>
    public OAuthIdLoginParameters([NotNull] string authorizationCode, [NotNull] string oAuthProvider, string oAuthUserId)
    {
        AuthorizationCode = authorizationCode;
        OAuthProvider = oAuthProvider;
        OAuthUserId = oAuthUserId;
    }

    private string authorizationCode;

    /// <summary>Gets or sets authorisation code used for the login.</summary>
    public string AuthorizationCode
    {
        get => authorizationCode;
        set => authorizationCode = Guard.NotWhiteSpace(value, nameof(value));
    }

    private string oAuthProvider;

    /// <summary>Gets or sets authorisation code used for the login.</summary>
    public string OAuthProvider
    {
        get => oAuthProvider;
        set => oAuthProvider = Guard.NotWhiteSpace(value, nameof(value));
    }

    /// <summary>Gets or sets authorisation code used for the login.</summary>
    public string OAuthUserId { get; set; }

    /// <summary>Indicates fresh login.</summary>
    public bool NewReq { get; set; }

    /// <summary>Indicates first login after registration.</summary>
    public bool NewUser { get; set; }
}
