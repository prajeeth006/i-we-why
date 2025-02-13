using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;

internal interface IInboxMessagesServiceClient
{
    Task<IReadOnlyList<InboxMessage>> GetAsync(ExecutionMode mode, InboxMessageFilter filter);
}

internal class InboxMessagesServiceClient(IPosApiRestClient restClient) : IInboxMessagesServiceClient
{
    private const string DateTimeFormat = "o";

    public async Task<IReadOnlyList<InboxMessage>> GetAsync(ExecutionMode mode, InboxMessageFilter filter)
    {
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.Notification)
            .AppendPathSegment("inbox")
            .AddQueryParametersIfValueNotWhiteSpace(
                ("status", filter?.Status),
                ("messageSource", filter?.MessageSource),
                ("startDate", filter?.StartDate?.Value.ToString(DateTimeFormat)),
                ("endDate", filter?.EndDate?.Value.ToString(DateTimeFormat)),
                ("pageSize", filter?.PageSize?.ToString()),
                ("pageIndex", filter?.PageIndex?.ToString()))
            .GetRelativeUri();
        var request = new PosApiRestRequest(url) { Authenticate = true };

        var response = await restClient.ExecuteAsync<InboxMessagesResponse>(mode, request);

        return response.GetData();
    }
}
