using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerArea;

internal interface IPlayerAreaServiceClient
{
    Task SetPlayerAreaAsync(SetPlayerAreaRequest setPlayerAreaRequest, ExecutionMode mode);
}

internal sealed class PlayerAreaServiceClient(IPosApiRestClient restClient) : IPlayerAreaServiceClient
{
    public async Task SetPlayerAreaAsync(SetPlayerAreaRequest setPlayerAreaRequest, ExecutionMode mode)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.ResponsibleGaming.PlayerArea, HttpMethod.Post)
        {
            Authenticate = true,
            Content = setPlayerAreaRequest,
        };

        await restClient.ExecuteAsync(mode, request);
    }
}
