using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Authentication.PendingActions;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.Login;

/// <summary>
/// The data response from login call.
/// </summary>
internal interface ILoginResult
{
    /// <summary>
    /// Gets the post login values.
    /// </summary>
    IReadOnlyDictionary<string, string> PostLoginValues { get; }

    /// <summary>
    /// Gets pending actions.
    /// </summary>
    PendingActionList PendingActions { get; }

    /// <summary>
    /// Keys that should be submitted to AddWorkflowData before FinalizeWorkflow is called.
    /// Null if no such data should be set.
    /// </summary>
    IReadOnlyList<string> WorkflowKeys { get; }

    /// <summary>
    /// Gets super cookie.
    /// </summary>
    string SuperCookie { get; }

    /// <summary>
    /// Gets super cookie.
    /// </summary>
    [CanBeNull]
    string RememberMeToken { get; }
}

internal sealed class LoginResult(
    UtcDateTime lastLogin = default,
    UtcDateTime lastLogout = default,
    PendingActionList pendingActions = null,
    IEnumerable<string> workflowKeys = null,
    IEnumerable<KeyValuePair<string, string>> postLoginValues = null,
    string superCookie = null,
    string rememberMeToken = null)
    : ILoginResult
{
    public UtcDateTime LastLogin { get; } = lastLogin;
    public UtcDateTime LastLogout { get; } = lastLogout;
    public PendingActionList PendingActions { get; } = pendingActions;
    public IReadOnlyList<string> WorkflowKeys { get; } = workflowKeys?.ToList().AsReadOnly();
    public IReadOnlyDictionary<string, string> PostLoginValues { get; } = postLoginValues?.ToDictionary().AsReadOnly();
    public string SuperCookie { get; } = superCookie;
    public string RememberMeToken { get; } = rememberMeToken;
}
