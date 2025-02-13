using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.Login;

/// <summary>
/// Specifies parameters for the workflow methods (finalize, skip).
/// </summary>
public sealed class WorkflowParameters
{
    /// <summary>Creates a new instance.</summary>
    public WorkflowParameters(string loginType = null)
        => LoginType = loginType;

    /// <summary>Gets or sets the SSO token.</summary>
    [CanBeNull]
    public string LoginType { get; set; }
}
