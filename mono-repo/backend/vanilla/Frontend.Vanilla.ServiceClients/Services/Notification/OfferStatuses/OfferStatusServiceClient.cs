using System;
using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Notification.OfferStatuses;

internal interface IOfferStatusServiceClient
{
    Task<string> GetAsync(ExecutionMode mode, string type, string id);
    Task<string> PostAsync(ExecutionMode mode, string type, string id, bool optIn, string source);
}

internal class OfferStatusServiceClient(IPosApiRestClient restClient) : IOfferStatusServiceClient
{
    public Task<string> GetAsync(ExecutionMode mode, string type, string id)
        => MakeRequest(mode, type, id, HttpMethod.Get, null);

    public Task<string> PostAsync(ExecutionMode mode, string type, string id, bool optIn, string source)
        => MakeRequest(mode, type, id, HttpMethod.Post, new UpdateOfferStatusDto
        {
            OptIn = optIn,
            Source = source,
        });

    private async Task<string> MakeRequest(ExecutionMode mode, string type, string id, HttpMethod method, object data)
    {
        Guard.NotWhiteSpace(id, nameof(id));
        Guard.NotWhiteSpace(type, nameof(type));

        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.Notification)
            .AppendPathSegment("offers")
            .AppendPathSegment(type)
            .AppendPathSegment(id)
            .AppendPathSegment("status")
            .GetRelativeUri();

        var dto = await restClient.ExecuteAsync<OfferStatusResponse>(
            mode,
            new PosApiRestRequest(url, method)
            {
                Authenticate = true,
                Content = data,
            });

        return dto.Status;
    }
}
