using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;

internal interface ISingleInboxMessageServiceClient
{
    Task<InboxMessage> GetAsync(ExecutionMode mode, string messageId);
}

internal class SingleInboxMessageServiceClient(IPosApiRestClient restClient) : ISingleInboxMessageServiceClient
{
    public Task<InboxMessage> GetAsync(ExecutionMode mode, string messageId)
    {
        Guard.NotWhiteSpace(messageId, nameof(messageId));

        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.Notification)
            .AppendPathSegment("inbox")
            .AppendPathSegment(messageId)
            .GetRelativeUri();
        var request = new PosApiRestRequest(url) { Authenticate = true };

        return restClient.ExecuteAsync<InboxMessage>(mode, request);
    }
}
