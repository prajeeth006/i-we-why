using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Execution;

/// <summary>
/// All service client methods which end up with successful login.
/// </summary>
internal interface ILoginServiceClient
{
    Task<ILoginResult> LoginByUsernameAsync(ExecutionMode mode, LoginParameters parameters);
    Task<ILoginResult> LoginByPidAsync(ExecutionMode mode, PidLoginParameters parameters);
    Task<ILoginResult> LoginByOAuthIdAsync(ExecutionMode mode, OAuthIdLoginParameters parameters);
    Task<ILoginResult> LoginByRememberMeTokenAsync(ExecutionMode mode, RememberMeLoginParameters parameters);
    Task<ILoginResult> AutoLoginAsync(ExecutionMode mode, AutoLoginParameters parameters);
    Task<ILoginResult> LoginByAuthTokensAsync(ExecutionMode mode, string userToken, string sessionToken, string productId);
    Task<ILoginResult> SkipWorkflowAsync(ExecutionMode mode, WorkflowParameters parameters, string productId);
    Task<ILoginResult> FinalizeWorkflowAsync(ExecutionMode mode, WorkflowParameters parameters, string productId);
}

internal sealed class LoginServiceClient(ILoginExecutor loginExecutor) : ILoginServiceClient
{
    public Task<ILoginResult> LoginByUsernameAsync(ExecutionMode mode, LoginParameters parameters)
        => LoginCommonAsync(mode, parameters, urlPath: "Login");

    public Task<ILoginResult> LoginByPidAsync(ExecutionMode mode, PidLoginParameters parameters)
        => LoginCommonAsync(mode, parameters, urlPath: "Login/PID");

    public Task<ILoginResult> LoginByRememberMeTokenAsync(ExecutionMode mode, RememberMeLoginParameters parameters)
        => LoginCommonAsync(mode, parameters, urlPath: "Login/RememberMe");

    private Task<ILoginResult> LoginCommonAsync(ExecutionMode mode, CommonLoginParameters parameters, string urlPath)
    {
        Guard.NotNull(parameters, nameof(parameters));

        var headers = new RestRequestHeaders();
        headers.AddIfValueNotWhiteSpace(
            (PosApiHeaders.ChannelId, parameters.ChannelId),
            (PosApiHeaders.ProductId, parameters.ProductId),
            (PosApiHeaders.VanillaId, parameters.VanillaIdToken),
            (PosApiHeaders.BrandId, parameters.BrandId));

        return ExecuteAsync(mode, urlPath, content: parameters, headers: headers);
    }

    public Task<ILoginResult> AutoLoginAsync(ExecutionMode mode, AutoLoginParameters parameters)
    {
        Guard.NotNull(parameters, nameof(parameters));

        return ExecuteAsync(mode, urlPath: "AutoLogin", content: parameters);
    }

    public Task<ILoginResult> LoginByAuthTokensAsync(ExecutionMode mode, string userToken, string sessionToken, string productId)
    {
        Guard.NotWhiteSpace(userToken, nameof(userToken));
        Guard.NotWhiteSpace(sessionToken, nameof(sessionToken));

        var headers = new Dictionary<string, StringValues>
        {
            { PosApiHeaders.UserToken, userToken },
            { PosApiHeaders.SessionToken, sessionToken },
        };

        if (!string.IsNullOrEmpty(productId))
        {
            headers.Add(PosApiHeaders.ProductId, productId);
        }

        return ExecuteAsync(mode, urlPath: "WorkflowLoginResponse", HttpMethod.Get, headers: headers);
    }

    public Task<ILoginResult> LoginByOAuthIdAsync(ExecutionMode mode, OAuthIdLoginParameters parameters)
        => LoginCommonAsync(mode, parameters, urlPath: "OAuthLogin");

    public Task<ILoginResult> SkipWorkflowAsync(ExecutionMode mode, WorkflowParameters parameters, string productId)
        => ExecuteAsync(mode,
            "SkipWorkflow",
            queryParameters: (nameof(parameters.LoginType), parameters.LoginType),
            authenticate: true,
            headers: string.IsNullOrEmpty(productId)
                ? null
                : new Dictionary<string, StringValues>
                {
                    { PosApiHeaders.ProductId, productId },
                });

    public Task<ILoginResult> FinalizeWorkflowAsync(ExecutionMode mode, WorkflowParameters parameters, string productId)
        => ExecuteAsync(mode,
            "FinalizeWorkflow",
            queryParameters: (nameof(parameters.LoginType), parameters.LoginType),
            authenticate: true,
            headers: string.IsNullOrEmpty(productId)
                ? null
                : new Dictionary<string, StringValues>
                {
                    { PosApiHeaders.ProductId, productId },
                });

    private async Task<ILoginResult> ExecuteAsync(
        ExecutionMode mode,
        string urlPath,
        HttpMethod method = null,
        object content = null,
        (string Name, string Value) queryParameters = default,
        bool authenticate = false,
        IEnumerable<KeyValuePair<string, StringValues>> headers = null)
    {
        // TODO: Read from PosApiEndpoint
        var urlBuilder = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.Authentication)
            .AppendPathSegment(urlPath);

        if (!queryParameters.Equals(default))
        {
            urlBuilder = urlBuilder.AddQueryParameters(queryParameters);
        }

        var url = urlBuilder.GetRelativeUri();

        var request = new PosApiRestRequest(url, method ?? HttpMethod.Post)
        {
            Authenticate = authenticate,
            Content = content,
            Headers = { headers.NullToEmpty() },
        };

        return await loginExecutor.ExecuteAsync(mode, request);
    }
}
