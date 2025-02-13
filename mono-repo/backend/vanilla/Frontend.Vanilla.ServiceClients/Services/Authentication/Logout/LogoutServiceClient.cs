#nullable enable

using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Security.Claims;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.Logout;

/// <summary>
/// Logout logic.
/// </summary>
internal interface ILogoutServiceClient
{
    Task LogoutAsync(ExecutionMode mode);
    Task CancelWorkflowAsync(ExecutionMode mode);
}

internal class LogoutServiceClient(
    IPosApiRestClient restClient,
    ICurrentUserAccessor currentUserAccessor,
    IClaimsCache claimsCache,
    IClaimsServiceClient setupUserServiceClient)
    : ILogoutServiceClient
{
    public Task LogoutAsync(ExecutionMode mode)
        => ExecuteAsync(mode, PosApiEndpoint.Authentication.Logout);

    public Task CancelWorkflowAsync(ExecutionMode mode)
        => ExecuteAsync(mode, PosApiEndpoint.Authentication.CancelWorkflow);

    private async Task ExecuteAsync(ExecutionMode mode, PathRelativeUri relativeUri)
    {
        var tokens = currentUserAccessor.User.GetPosApiAuthTokens();

        if (tokens == null)
        {
            return; // Already logged out
        }

        var request = new PosApiRestRequest(relativeUri, HttpMethod.Post) { Authenticate = true };

        try
        {
            await restClient.ExecuteAsync(mode, request);
        }
        catch (PosApiException paex) when (paex.IsInvalidOrExpiredAuthToken())
        {
            // Already logged out on PosAPI -> regular traffic
        }
        finally // Even if failed -> get user to valid anonymous state so that he can continue
        {
            var cleanupTask = claimsCache.RemoveAsync(mode, tokens); // Run in parallel
            await setupUserServiceClient.SetupAnonymousUserAsync(mode);
            await cleanupTask;
        }
    }
}
