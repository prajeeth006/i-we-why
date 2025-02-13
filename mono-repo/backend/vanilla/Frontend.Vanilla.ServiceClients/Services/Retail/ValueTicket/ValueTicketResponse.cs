using System;
using System.Collections.Generic;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Retail.ValueTicket;

/// <summary>
/// Value ticket response.
/// </summary>
public sealed class ValueTicketResponse
{
    /// <summary>
    /// Value ticket ID.
    /// </summary>
    public string ValueTicketId { get; }

    /// <summary>
    /// Value ticket status.
    /// </summary>
    public string ValueTicketStatus { get; }

    /// <summary>
    /// Currency.
    /// </summary>
    public string Currency { get; }

    /// <summary>
    /// Amount.
    /// </summary>
    public long Amount { get; }

    /// <summary>
    /// Shop ID.
    /// </summary>
    public string ShopId { get; }

    /// <summary>
    /// Terminal ID.
    /// </summary>
    public string TerminalId { get; }

    /// <summary>
    /// Terminal ID Paid-out.
    /// </summary>
    [CanBeNull]
    public string TerminalIdPaidOut { get; }

    /// <summary>
    /// Printed date.
    /// </summary>
    public DateTime PrintedDate { get; }

    /// <summary>
    /// Paid-out date.
    /// </summary>
    public DateTime? PaidOutDate { get; }

    /// <summary>
    /// Agent name.
    /// </summary>
    [CanBeNull]
    public string AgentName { get; }

    /// <summary>
    /// Comments.
    /// </summary>
    [CanBeNull]
    public string Comments { get; }

    /// <summary>
    /// AML decision history details.
    /// </summary>
    [CanBeNull]
    public IReadOnlyList<DecisionHistoryDetails> AmlDecisionHistoryDetails { get; }

    /// <summary>
    /// Locking detail.
    /// </summary>
    [CanBeNull]
    public LockingDetail LockingDetail { get; }

    /// <summary>
    /// Unlocking detail.
    /// </summary>
    [CanBeNull]
    public UnlockingDetail UnlockingDetail { get; }

    /// <summary>
    /// Status.
    /// </summary>
    public string Status { get; }

    /// <summary>
    /// Error code.
    /// </summary>
    [CanBeNull]
    public string ErrorCode { get; }

    /// <summary>
    /// Error message.
    /// </summary>
    [CanBeNull]
    public string ErrorMsg { get; }

    /// <summary>
    /// Aml current status.
    /// </summary>
    public string AmlCurrentStatus { get; }

    /// <summary>
    /// ValueTicketResponse.
    /// </summary>
    public ValueTicketResponse(
        string valueTicketId = default,
        string valueTicketStatus = default,
        string currency = default,
        long amount = default,
        string shopId = default,
        string terminalId = default,
        [CanBeNull] string terminalIdPaidOut = null,
        DateTime printedDate = default,
        DateTime? paidOutDate = default,
        [CanBeNull] string agentName = default,
        [CanBeNull] string comments = null,
        [CanBeNull] IReadOnlyList<DecisionHistoryDetails> amlDecisionHistoryDetails = default,
        [CanBeNull] LockingDetail lockingDetail = default,
        [CanBeNull] UnlockingDetail unlockingDetail = default,
        string status = default,
        [CanBeNull] string errorCode = null,
        [CanBeNull] string errorMsg = null,
        [CanBeNull] string amlCurrentStatus = null)
    {
        ValueTicketId = valueTicketId;
        ValueTicketStatus = valueTicketStatus;
        Currency = currency;
        Amount = amount;
        ShopId = shopId;
        TerminalId = terminalId;
        TerminalIdPaidOut = terminalIdPaidOut;
        PrintedDate = printedDate;
        PaidOutDate = paidOutDate;
        AgentName = agentName;
        Comments = comments;
        AmlDecisionHistoryDetails = amlDecisionHistoryDetails;
        LockingDetail = lockingDetail;
        UnlockingDetail = unlockingDetail;
        Status = status;
        ErrorCode = errorCode;
        ErrorMsg = errorMsg;
        AmlCurrentStatus = amlCurrentStatus;
    }
}

/// <summary>
/// DecisionHistoryDetails response.
/// </summary>
public sealed class DecisionHistoryDetails
{
    /// <summary>
    /// Is manual ticket locking.
    /// </summary>
    public bool? IsManualTicketLocking { get; }

    /// <summary>
    /// Locking reason AML.
    /// </summary>
    [CanBeNull]
    public string LockingReasonAML { get; }

    /// <summary>
    /// Shop agent name.
    /// </summary>
    public string ShopAgentName { get; }

    /// <summary>
    /// Change value ticket date.
    /// </summary>
    public DateTime? ChangeValueTicketDate { get; }

    /// <summary>
    /// AML agent name.
    /// </summary>
    public string AmlAgentName { get; }

    /// <summary>
    /// ValueTicketResponse.
    /// </summary>
    public string AmlPreviousStatus { get; }

    /// <summary>
    /// AML current status.
    /// </summary>
    [CanBeNull]
    public string AmlCurrentStatus { get; }

    /// <summary>
    /// Comments.
    /// </summary>
    public string Comments { get; }

    /// <summary>
    /// AML decision date.
    /// </summary>
    public DateTime? AmlDecisionDate { get; }

    /// <summary>
    /// DecisionHistoryDetails.
    /// </summary>
    public DecisionHistoryDetails(
        [CanBeNull] bool? isManualTicketLocking,
        [CanBeNull] string lockingReasonAml = default,
        string shopAgentName = default,
        [CanBeNull] DateTime? changeValueTicketDate = null,
        [CanBeNull] string amlAgentName = null,
        [CanBeNull] string amlPreviousStatus = null,
        string amlCurrentStatus = default,
        [CanBeNull] string comments = null,
        [CanBeNull] DateTime? amlDecisionDate = null)
    {
        IsManualTicketLocking = isManualTicketLocking;
        LockingReasonAML = lockingReasonAml;
        ShopAgentName = shopAgentName;
        ChangeValueTicketDate = changeValueTicketDate;
        AmlAgentName = amlAgentName;
        AmlPreviousStatus = amlPreviousStatus;
        AmlCurrentStatus = amlCurrentStatus;
        Comments = comments;
        AmlDecisionDate = amlDecisionDate;
    }
}

/// <summary>
/// LockingDetail response.
/// </summary>
public sealed class LockingDetail
{
    /// <summary>
    /// Status.
    /// </summary>
    public string Status { get; }

    /// <summary>
    /// Locking reason.
    /// </summary>
    public string LockingReason { get; }

    /// <summary>
    /// Locking user.
    /// </summary>
    public string LockingUser { get; }

    /// <summary>
    /// Locking time.
    /// </summary>
    public DateTime? LockingTime { get; }

    /// <summary>
    /// Manual lock.
    /// </summary>
    public bool? ManualLock { get; }

    /// <summary>
    /// LockingDetail.
    /// </summary>
    public LockingDetail(
        string status = default,
        string lockingReason = default,
        string lockingUser = default,
        [CanBeNull] DateTime? lockingTime = null,
        [CanBeNull] bool? manualLock = null)
    {
        Status = status;
        LockingReason = lockingReason;
        LockingUser = lockingUser;
        LockingTime = lockingTime;
        ManualLock = manualLock;
    }
}

/// <summary>
/// UnlockingDetail response.
/// </summary>
public sealed class UnlockingDetail
{
    /// <summary>
    /// Status.
    /// </summary>
    public string Status { get; }

    /// <summary>
    /// Unlocking reason.
    /// </summary>
    public string UnlockingReason { get; }

    /// <summary>
    /// Unlocking user.
    /// </summary>
    public string UnlockingUser { get; }

    /// <summary>
    /// Unlocking time.
    /// </summary>
    public DateTime? UnlockingTime { get; }

    /// <summary>
    /// UnlockingDetail.
    /// </summary>
    public UnlockingDetail(
        string status = default,
        string unlockingReason = default,
        string unlockingUser = default,
        [CanBeNull] DateTime? unlockingTime = null)
    {
        Status = status;
        UnlockingReason = unlockingReason;
        UnlockingUser = unlockingUser;
        UnlockingTime = unlockingTime;
    }
}
