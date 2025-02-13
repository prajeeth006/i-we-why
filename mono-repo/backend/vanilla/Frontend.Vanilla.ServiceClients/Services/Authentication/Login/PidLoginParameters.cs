using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.Login;

/// <summary>
/// Specifies parameters for the login by username and password.
/// </summary>
internal sealed class PidLoginParameters : OptionalUsernameLoginParameters
{
    /// <summary>Creates a new instance.</summary>
    public PidLoginParameters([NotNull] string pid)
        => Pid = pid;

    private string pid;

    /// <summary>
    /// Gets or sets the PID.
    /// </summary>
    [NotNull]
    public string Pid
    {
        get => pid;
        set => pid = Guard.NotWhiteSpace(value, nameof(value));
    }
}
