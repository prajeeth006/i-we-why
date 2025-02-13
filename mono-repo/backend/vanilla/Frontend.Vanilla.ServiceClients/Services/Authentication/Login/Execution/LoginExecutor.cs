#nullable enable

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Execution;

/// <summary>
/// Common logic for login based on specific given request.
/// </summary>
internal interface ILoginExecutor
{
    Task<LoginResult> ExecuteAsync(ExecutionMode mode, PosApiRestRequest request);
}

internal sealed class LoginExecutor(
    IPosApiRestClient restClient,
    IPosApiClaimsDeserializer posApiClaimsDeserializer,
    IClaimsUserManager claimsUserManager,
    IEnumerable<ILoginFilter> filters)
    : ILoginExecutor
{
    private readonly IReadOnlyList<ILoginFilter> filters = filters.ToArray();

    public async Task<LoginResult> ExecuteAsync(ExecutionMode mode, PosApiRestRequest request)
    {
        var beforeContext = new BeforeLoginContext(mode, request);
        foreach (var filter in filters)
            await filter.BeforeLoginAsync(beforeContext);

        var result = await restClient.ExecuteAsync<LoginResponse>(mode, request);
        var posApiClaims = posApiClaimsDeserializer.Deserialize(result, new PosApiAuthTokens(result.UserToken, result.SessionToken));
        await claimsUserManager.SetCurrentAsync(mode, posApiClaims, writeClaimsToCache: true);

        var afterContext = new AfterLoginContext(mode, request, result);
        foreach (var filter in filters.Reverse())
            await filter.AfterLoginAsync(afterContext);

        return new LoginResult(
            result.LastLoginUtc,
            result.LastLogoutUtc,
            result.PendingActions,
            result.WorkflowKeys,
            result.PostLoginValues,
            result.SuperCookie,
            result.RememberMeToken);
    }
}
