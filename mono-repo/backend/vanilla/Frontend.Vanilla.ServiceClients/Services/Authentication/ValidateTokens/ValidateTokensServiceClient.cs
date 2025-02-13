#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.ValidateTokens;

/// <summary>
/// Checks validity of current user and session tokens on PosAPI side without executing any heavier operation.
/// </summary>
internal interface IValidateTokensServiceClient
{
    Task ValidateAsync(ExecutionMode mode, PosApiAuthTokens authTokens);
}

internal sealed class ValidateTokensServiceClient(IPosApiRestClient restClient) : IValidateTokensServiceClient
{
    public Task ValidateAsync(ExecutionMode mode, PosApiAuthTokens authTokens)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.Authentication.ValidateTokens)
        {
            Headers =
            {
                { PosApiHeaders.UserToken, authTokens.UserToken },
                { PosApiHeaders.SessionToken, authTokens.SessionToken },
            },
        };

        return restClient.ExecuteAsync(mode, request);
    }
}
