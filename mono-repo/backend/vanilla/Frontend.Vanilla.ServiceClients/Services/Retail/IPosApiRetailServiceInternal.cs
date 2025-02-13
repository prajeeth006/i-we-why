using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Retail.PayoutValueTicket;
using Frontend.Vanilla.ServiceClients.Services.Retail.TerminalSession;
using Frontend.Vanilla.ServiceClients.Services.Retail.ValueTicket;

namespace Frontend.Vanilla.ServiceClients.Services.Retail;

internal interface IPosApiRetailServiceInternal
{
    [DelegateTo(typeof(IValueTicketServiceClient), nameof(IValueTicketServiceClient.GetValueTicketAsync))]
    Task<ValueTicketResponse> GetValueTicketAsync(ValueTicketRequest request, CancellationToken cancellationToken);

    [DelegateTo(typeof(IPayoutValueTicketServiceClient), nameof(IPayoutValueTicketServiceClient.PayoutValueTicketAsync))]
    Task<PayoutValueTicketResponse> PayoutValueTicketAsync(PayoutValueTicketRequest request, CancellationToken cancellationToken);

    [DelegateTo(typeof(ITerminalSessionServiceClient), nameof(ITerminalSessionServiceClient.GetAsync))]
    Task<TerminalSessionDto> GetTerminalSessionAsync(ExecutionMode mode, bool cached = true);
}
