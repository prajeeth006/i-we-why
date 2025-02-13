using System;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Retail.PayoutValueTicket;

internal sealed class PayoutValueTicketDto : IPosApiResponse<PayoutValueTicketResponse>
{
    public long Amount { get; set; }
    public string Currency { get; set; }
    public string ErrorCode { get; set; }
    public string ErrorDesc { get; set; }
    public string Status { get; set; }
    public DateTime TransactionDate { get; set; }
    public string ValueTicketStatus { get; set; }
    public long WltRefId { get; set; }

    public PayoutValueTicketResponse GetData() => new PayoutValueTicketResponse(
        amount: Amount,
        currency: Currency,
        errorCode: ErrorCode,
        errorDesc: ErrorDesc,
        status: Status,
        transactionDate: TransactionDate,
        valueTicketStatus: ValueTicketStatus,
        wltRefId: WltRefId);
}
