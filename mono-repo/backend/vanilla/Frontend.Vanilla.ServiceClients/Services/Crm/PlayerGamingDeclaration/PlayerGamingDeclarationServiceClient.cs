using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.PlayerGamingDeclaration;

internal interface IPlayerGamingDeclarationServiceClient
{
    Task<GamingDeclaration> GetAsync(ExecutionMode mode);
    Task AcceptDeclarationAsync(GamingDeclarationRequest declarationRequest, ExecutionMode mode);
}

internal class PlayerGamingDeclarationServiceClient(IPosApiRestClient restClient) : IPlayerGamingDeclarationServiceClient
{
    public async Task<GamingDeclaration> GetAsync(ExecutionMode mode)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.Crm.PlayerGamingDeclaration) { Authenticate = true };

        var response = await restClient.ExecuteAsync<GamingDeclaration>(mode, request);

        return response;
    }

    public async Task AcceptDeclarationAsync(GamingDeclarationRequest declarationRequest, ExecutionMode mode)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.Crm.PlayerGamingDeclaration, HttpMethod.Post)
        {
            Authenticate = true,
            Content = declarationRequest,
        };

        await restClient.ExecuteAsync(mode, request);
    }
}
