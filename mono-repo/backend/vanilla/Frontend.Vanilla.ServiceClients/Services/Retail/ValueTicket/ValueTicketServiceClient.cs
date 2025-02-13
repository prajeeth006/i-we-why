using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Retail.ValueTicket;

internal interface IValueTicketServiceClient
{
    Task<ValueTicketResponse> GetValueTicketAsync(ExecutionMode mode, ValueTicketRequest request);
}

internal class ValueTicketServiceClient(IPosApiRestClient restClient) : IValueTicketServiceClient
{
    public async Task<ValueTicketResponse> GetValueTicketAsync(ExecutionMode mode, ValueTicketRequest request)
    {
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.Retail)
            .AppendPathSegment($"ValueTicket")
            .AppendPathSegment(request.Id)
            .AddQueryParameters(("source", request.Source))
            .AddQueryParametersIfValueNotWhiteSpace(("shopId", request.ShopId))
            .AddQueryParametersIfValueNotWhiteSpace(("terminalId", request.TerminalId))
            .GetRelativeUri();

        var posApiRequest = new PosApiRestRequest(url) { Authenticate = true };
        var response = await restClient.ExecuteAsync<ValueTicketDto>(mode, posApiRequest);

        return response?.GetData();
    }
}
