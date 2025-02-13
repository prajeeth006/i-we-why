using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.Affordability;

internal interface IAffordabilityServiceClient
{
    Task<AffordabilitySnapshotDetailsResponse> GetAffordabilitySnapshotDetailsAsync(CancellationToken cancellationToken);
}

internal class AffordabilityServiceClient(IPosApiRestClient restClient) : IAffordabilityServiceClient
{
    public async Task<AffordabilitySnapshotDetailsResponse> GetAffordabilitySnapshotDetailsAsync(CancellationToken cancellationToken)
    {
        var posApiRequest = new PosApiRestRequest(PosApiEndpoint.ResponsibleGaming.AffordabilitySnapshotDetailsV2, HttpMethod.Post)
        {
            Authenticate = true,
            Content = new AffordabilitySnapshotDetailsRequest(),
        };
        var response = await restClient.ExecuteAsync<AffordabilitySnapshotDetailsResponse>(posApiRequest, cancellationToken);

        return response;
    }
}
