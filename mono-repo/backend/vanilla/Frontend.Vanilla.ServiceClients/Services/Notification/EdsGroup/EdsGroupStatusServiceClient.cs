using System;
using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Notification.EdsGroup;

internal interface IEdsGroupStatusServiceClient
{
    Task<EdsGroupStatus> GetAsync(ExecutionMode mode, string groupId, bool cached);
    Task<EdsGroupOptIn> PostAsync(ExecutionMode mode, EdsGroupOptInRequest request);
}

internal class EdsGroupStatusServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache) : IEdsGroupStatusServiceClient
{
    public Task<EdsGroupStatus> GetAsync(ExecutionMode mode, string groupId, bool cached = true)
    {
        Guard.NotWhiteSpace(groupId, nameof(groupId));

        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.Notification)
            .AppendPathSegment("eds")
            .AppendPathSegment("group")
            .AppendPathSegment(groupId)
            .AppendPathSegment("optin")
            .AppendPathSegment("status")
            .GetRelativeUri();

        return cache.GetOrCreateAsync(
            mode,
            PosApiDataType.User,
            "EdsGroupStatus",
            async () =>
            {
                var dto = await restClient.ExecuteAsync<EdsGroupStatusResponse>(
                    mode,
                    new PosApiRestRequest(url)
                    {
                        Authenticate = true,
                    });

                return dto.GetData();
            },
            cached);
    }

    public async Task<EdsGroupOptIn> PostAsync(ExecutionMode mode, EdsGroupOptInRequest request)
    {
        var response = await restClient.ExecuteAsync<EdsGroupOptInResponse>(
            mode,
            new PosApiRestRequest(PosApiEndpoint.Notification.EdsGroupOptIn, HttpMethod.Post)
            {
                Authenticate = true,
                Content = request,
            });

        return response.GetData();
    }
}
