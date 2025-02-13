using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.TrackerUrl;

internal interface ITrackerUrlServiceClient
{
    Task<string> GetAsync(ExecutionMode mode, int? webmasterId, string tdUid, string channelId, string productId);
}

internal class TrackerUrlServiceClient(IPosApiRestClient restClient) : ITrackerUrlServiceClient
{
    public async Task<string> GetAsync(ExecutionMode mode, int? webmasterId, string tdUid, string channelId, string productId)
    {
        // TODO: Read from PosApiEndpoint
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.Crm)
            .AppendPathSegment("TrackerUrl")
            .AddQueryParametersIfValueNotWhiteSpace(
                ("webmasterId", webmasterId.ToString()),
                ("tdUid", tdUid))
            .GetRelativeUri();

        var request = new PosApiRestRequest(url) { Authenticate = true };

        request.Headers.AddIfValueNotWhiteSpace(
            (PosApiHeaders.ChannelId, channelId),
            (PosApiHeaders.ProductId, productId));

        var response = await restClient.ExecuteAsync<TrackerUrlDto>(mode, request);

        return response.Url;
    }
}
