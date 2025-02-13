using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Retail.PayoutValueTicket;

internal interface IPayoutValueTicketServiceClient
{
    Task<PayoutValueTicketResponse> PayoutValueTicketAsync(ExecutionMode mode, PayoutValueTicketRequest request);
}

internal class PayoutValueTicketServiceClient(IPosApiRestClient restClient) : IPayoutValueTicketServiceClient
{
    public async Task<PayoutValueTicketResponse> PayoutValueTicketAsync(ExecutionMode mode, PayoutValueTicketRequest request)
    {
        var posApiRequest = new PosApiRestRequest(PosApiEndpoint.Retail.PayoutValueTicket(request.Id), HttpMethod.Post)
        {
            Authenticate = true,
            Content = request,
        };
        var response = await restClient.ExecuteAsync<PayoutValueTicketDto>(mode, posApiRequest);

        return response?.GetData();
    }
}
