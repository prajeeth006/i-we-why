#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication;

/// <summary>
/// Refreshes (prolongs expiration of) authentication token on PosAPI and the platform without executing any other operation.
/// </summary>
internal interface IRefreshTokenServiceClient
{
    Task RefreshAsync(ExecutionMode mode);
}

internal sealed class RefreshTokenServiceClient(IPosApiRestClient restClient) : IRefreshTokenServiceClient
{
    public async Task RefreshAsync(ExecutionMode mode)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.Authentication.Refresh) { Authenticate = true };

        await restClient.ExecuteAsync(mode, request);
    }
}
