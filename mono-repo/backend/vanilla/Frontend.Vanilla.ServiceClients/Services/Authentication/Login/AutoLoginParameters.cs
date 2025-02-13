using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.Login;

/// <summary>
/// Specifies parameters for the auto-login.
/// </summary>
internal sealed class AutoLoginParameters : LoginParametersBase
{
    /// <summary>Creates a new instance.</summary>
    public AutoLoginParameters([NotNull] string ssoToken)
        => SsoToken = ssoToken;

    private string ssoToken;

    /// <summary>Gets or sets the SSO token.</summary>
    [NotNull]
    public string SsoToken
    {
        get => ssoToken;
        set => ssoToken = Guard.NotWhiteSpace(value, nameof(value));
    }

    /// <summary>Gets or sets the invoker's product ID.</summary>
    [CanBeNull]
    public string InvokersProductId { get; set; }

    /// <summary>Gets or sets the invoker's session token.</summary>
    [CanBeNull]
    public string InvokersSessionToken { get; set; }

    /// <summary>Indicates if the session shall be marked as embedded (e.g. originated from download client).</summary>
    public bool IsEmbeddedSession { get; set; }

    /// <summary>Gets or sets flag indicating type of username and password e.g. 'online' username with password or 'connect card' with pin code.</summary>
    [CanBeNull]
    public string LoginType { get; set; }

    [CanBeNull]
    public string TerminalId { get; set; }

    [CanBeNull]
    public string ShopId { get; set; }
}
