using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.AddWorkflowData;

internal interface IAddWorkflowDataServiceClient
{
    Task AddWorkflowDataAsync(IReadOnlyDictionary<string, string> workflowData, CancellationToken cancellationToken);
}

internal class AddWorkflowDataServiceClient(IPosApiRestClient restClient) : IAddWorkflowDataServiceClient
{
    public Task AddWorkflowDataAsync(IReadOnlyDictionary<string, string> workflowData, CancellationToken cancellationToken)
    {
        Guard.NotEmpty(workflowData, nameof(workflowData));

        var request = new PosApiRestRequest(PosApiEndpoint.Authentication.WorkflowData, HttpMethod.Post)
        {
            Authenticate = true,
            Content = workflowData,
        };

        return restClient.ExecuteAsync(request, cancellationToken);
    }
}
