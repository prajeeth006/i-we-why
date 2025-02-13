using System;

namespace Frontend.Vanilla.ServiceClients.Services.Retail.PayoutValueTicket;

/// <summary>
/// PayoutValueTicketResponse response.
/// </summary>
public sealed class PayoutValueTicketResponse
{
    /// <summary>
    /// Amount.
    /// </summary>
    public long Amount { get; }

    /// <summary>
    /// Currency.
    /// </summary>
    public string Currency { get; }

    /// <summary>
    /// Error code.
    /// </summary>
    public string ErrorCode { get; }

    /// <summary>
    /// Error description.
    /// </summary>
    public string ErrorDesc { get; }

    /// <summary>
    /// Status.
    /// </summary>
    public string Status { get; }

    /// <summary>
    /// Transaction date.
    /// </summary>
    public DateTime TransactionDate { get; }

    /// <summary>
    /// Value ticket status.
    /// </summary>
    public string ValueTicketStatus { get; }

    /// <summary>
    /// Wlt reference ID.
    /// </summary>
    public long WltRefId { get; }

    /// <summary>
    /// PayoutValueTicketResponse.
    /// </summary>
    public PayoutValueTicketResponse(
        long amount = default,
        string currency = default,
        string errorCode = default,
        string errorDesc = default,
        string status = default,
        DateTime transactionDate = default,
        string valueTicketStatus = default,
        long wltRefId = default)
    {
        Amount = amount;
        Currency = currency;
        ErrorCode = errorCode;
        ErrorDesc = errorDesc;
        Status = status;
        TransactionDate = transactionDate;
        ValueTicketStatus = valueTicketStatus;
        WltRefId = wltRefId;
    }
}
