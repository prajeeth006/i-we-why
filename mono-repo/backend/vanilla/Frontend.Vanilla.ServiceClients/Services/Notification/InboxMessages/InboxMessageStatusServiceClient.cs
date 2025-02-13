using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;

internal interface IInboxMessageStatusServiceClient
{
    Task UpdateAsync(ExecutionMode mode, IEnumerable<string> messageIds, string newStatus);
}

internal class InboxMessageStatusServiceClient(IPosApiRestClient restClient) : IInboxMessageStatusServiceClient
{
    public Task UpdateAsync(ExecutionMode mode, IEnumerable<string> messageIds, string newStatus)
    {
        Guard.NotWhiteSpace(newStatus, nameof(newStatus));

        return restClient.ExecuteAsync(mode, new PosApiRestRequest(PosApiEndpoint.Notification.InboxStatus, HttpMethod.Post)
        {
            Authenticate = true,
            Content = new UpdateInboxMessageStatusDto
            {
                MessageIds = Guard.NotEmptyNorNullItems(messageIds?.ToList(), nameof(messageIds)),
                NewStatus = newStatus,
            },
        });
    }
}
