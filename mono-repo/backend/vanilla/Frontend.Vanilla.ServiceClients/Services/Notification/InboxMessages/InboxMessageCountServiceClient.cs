using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;

internal interface IInboxMessageCountServiceClient
{
    Task<int> GetAsync(ExecutionMode mode, string status);
}

internal class InboxMessageCountServiceClient(IPosApiRestClient restClient) : IInboxMessageCountServiceClient
{
    public Task<int> GetAsync(ExecutionMode mode, string status)
    {
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.Notification)
            .AppendPathSegment("inbox")
            .AppendPathSegment("count")
            .AddQueryParametersIfValueNotWhiteSpace(("status", status))
            .GetRelativeUri();

        var request = new PosApiRestRequest(url) { Authenticate = true };

        return restClient.ExecuteAsync<int>(mode, request);
    }
}
