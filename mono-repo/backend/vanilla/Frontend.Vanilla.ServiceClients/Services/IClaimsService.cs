using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Execution;
using Frontend.Vanilla.ServiceClients.Services.Manager;

namespace Frontend.Vanilla.ServiceClients.Services;

/// <summary>
/// <see cref="System.Security.Claims" /> based authentication service. Handles any authentication related communication with PosApi and sets the correct principal on the current thread.
/// All exposed principals implement <see cref="ClaimsPrincipal" />. The anonymous user has a limited set of claims based on his IP address.
/// </summary>
internal interface IClaimsService
{
    /// <summary>
    /// Authenticates the user in the system.
    /// </summary>
    [DelegateTo(typeof(ILoginServiceClient), nameof(ILoginServiceClient.LoginByUsernameAsync))]
    ILoginResult Login(LoginParameters parameters);

    /// <summary>
    /// Authenticates the user in the system.
    /// </summary>
    [DelegateTo(typeof(ILoginServiceClient), nameof(ILoginServiceClient.LoginByUsernameAsync))]
    Task<ILoginResult> LoginAsync(LoginParameters parameters, CancellationToken cancellationToken);

    /// <summary>
    /// Authenticates with the given SSO Token. (AutoLogin).
    /// </summary>
    [DelegateTo(typeof(ILoginServiceClient), nameof(ILoginServiceClient.AutoLoginAsync))]
    ILoginResult Login(AutoLoginParameters parameters);

    /// <summary>
    /// Authenticates with the given SSO Token. (AutoLogin).
    /// </summary>
    [DelegateTo(typeof(ILoginServiceClient), nameof(ILoginServiceClient.AutoLoginAsync))]
    Task<ILoginResult> LoginAsync(AutoLoginParameters parameters, CancellationToken cancellationToken);

    /// <summary>
    /// Authenticates the user with given tokens.
    /// </summary>
    [DelegateTo(typeof(ILoginServiceClient), nameof(ILoginServiceClient.LoginByAuthTokensAsync))]
    ILoginResult Login(string userToken, string sessionToken, string productId);

    /// <summary>
    /// Authenticates the user with given tokens.
    /// </summary>
    [DelegateTo(typeof(ILoginServiceClient), nameof(ILoginServiceClient.LoginByAuthTokensAsync))]
    Task<ILoginResult> LoginAsync(string userToken, string sessionToken, string productId, CancellationToken cancellationToken);

    /// <summary>
    /// Authenticates with the given PID. (Login/PID).
    /// </summary>
    [DelegateTo(typeof(ILoginServiceClient), nameof(ILoginServiceClient.LoginByPidAsync))]
    ILoginResult Login(PidLoginParameters parameters);

    /// <summary>
    /// Authenticates on OAuthLogin endpoint.
    /// </summary>
    [DelegateTo(typeof(ILoginServiceClient), nameof(ILoginServiceClient.LoginByOAuthIdAsync))]
    ILoginResult Login(OAuthIdLoginParameters parameters);

    /// <summary>
    /// Authenticates on OAuthLogin endpoint.
    /// </summary>
    [DelegateTo(typeof(ILoginServiceClient), nameof(ILoginServiceClient.LoginByOAuthIdAsync))]
    Task<ILoginResult> LoginAsync(OAuthIdLoginParameters parameters, CancellationToken cancellationToken);

    /// <summary>
    /// Authenticates with the given PID. (Login/PID).
    /// </summary>
    [DelegateTo(typeof(ILoginServiceClient), nameof(ILoginServiceClient.LoginByPidAsync))]
    Task<ILoginResult> LoginAsync(PidLoginParameters parameters, CancellationToken cancellationToken);

    /// <summary>
    /// Finalizes the current workflow, and logs the user in.
    /// </summary>
    [DelegateTo(typeof(ILoginServiceClient), nameof(ILoginServiceClient.FinalizeWorkflowAsync))]
    ILoginResult FinalizeWorkflow(WorkflowParameters parameters, string productId);

    /// <summary>
    /// Finalizes the current workflow, and logs the user in.
    /// </summary>
    [DelegateTo(typeof(ILoginServiceClient), nameof(ILoginServiceClient.FinalizeWorkflowAsync))]
    Task<ILoginResult> FinalizeWorkflowAsync(WorkflowParameters parameters, string productId, CancellationToken cancellationToken);

    /// <summary>
    /// Skips the current workflow and logs the user in.
    /// </summary>
    [DelegateTo(typeof(ILoginServiceClient), nameof(ILoginServiceClient.SkipWorkflowAsync))]
    ILoginResult SkipWorkflow(WorkflowParameters parameters, string productId);

    /// <summary>
    /// Skips the current workflow and logs the user in.
    /// </summary>
    [DelegateTo(typeof(ILoginServiceClient), nameof(ILoginServiceClient.SkipWorkflowAsync))]
    Task<ILoginResult> SkipWorkflowAsync(WorkflowParameters parameters, string productId, CancellationToken cancellationToken);

    /// <summary>
    /// Gets the post login values.
    /// </summary>
    [DelegateTo(typeof(IPostLoginValuesManager), nameof(IPostLoginValuesManager.GetPostLoginValuesAsync))]
    IReadOnlyDictionary<string, object> GetPostLoginValues();

    /// <summary>
    /// Gets the post login values.
    /// </summary>
    [DelegateTo(typeof(IPostLoginValuesManager), nameof(IPostLoginValuesManager.GetPostLoginValuesAsync))]
    Task<IReadOnlyDictionary<string, object>> GetPostLoginValuesAsync(CancellationToken cancellationToken);

    /// <summary>
    /// Authenticates with remember-me token.
    /// </summary>
    [DelegateTo(typeof(ILoginServiceClient), nameof(ILoginServiceClient.LoginByRememberMeTokenAsync))]
    ILoginResult Login(RememberMeLoginParameters parameters);

    /// <summary>
    /// Authenticates with remember-me token.
    /// </summary>
    [DelegateTo(typeof(ILoginServiceClient), nameof(ILoginServiceClient.LoginByRememberMeTokenAsync))]
    Task<ILoginResult> LoginAsync(RememberMeLoginParameters parameters, CancellationToken cancellationToken);
}
