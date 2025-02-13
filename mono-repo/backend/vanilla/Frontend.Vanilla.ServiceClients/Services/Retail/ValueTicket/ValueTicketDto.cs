using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Retail.ValueTicket;

internal sealed class ValueTicketDto : IPosApiResponse<ValueTicketResponse>
{
    public string ValueTicketId { get; set; }
    public string ValueTicketStatus { get; set; }
    public string Currency { get; set; }
    public long Amount { get; set; }
    public string ShopId { get; set; }
    public string TerminalId { get; set; }

    [CanBeNull]
    public string TerminalIdPaidOut { get; set; }

    public DateTime PrintedDate { get; set; }
    public DateTime? PaidOutDate { get; set; }

    [CanBeNull]
    public string AgentName { get; set; }

    [CanBeNull]
    public string Comments { get; set; }

    [CanBeNull]
    public IReadOnlyList<DecisionHistoryDetailsDto> AmlDecisionHistoryDetails { get; set; }

    [CanBeNull]
    public LockingDetailDto LockingDetail { get; set; }

    [CanBeNull]
    public UnlockingDetailDto UnlockingDetail { get; set; }

    public string Status { get; set; }

    [CanBeNull]
    public string ErrorCode { get; set; }

    [CanBeNull]
    public string ErrorMsg { get; set; }

    [CanBeNull]
    public string AmlCurrentStatus { get; set; }

    public ValueTicketResponse GetData() => new ValueTicketResponse(
        valueTicketId: ValueTicketId,
        valueTicketStatus: ValueTicketStatus,
        currency: Currency,
        amount: Amount,
        shopId: ShopId,
        terminalId: TerminalId,
        terminalIdPaidOut: TerminalIdPaidOut,
        printedDate: PrintedDate,
        paidOutDate: PaidOutDate,
        agentName: AgentName,
        comments: Comments,
        amlDecisionHistoryDetails: AmlDecisionHistoryDetails?.Select(details => details?.GetData()).ToList(),
        lockingDetail: LockingDetail?.GetData(),
        unlockingDetail: UnlockingDetail?.GetData(),
        status: Status,
        errorCode: ErrorCode,
        errorMsg: ErrorMsg,
        amlCurrentStatus: AmlCurrentStatus);
}

internal sealed class DecisionHistoryDetailsDto : IPosApiResponse<DecisionHistoryDetails>
{
    public bool? IsManualTicketLocking { get; set; }

    [CanBeNull]
    public string LockingReasonAML { get; set; }

    public string ShopAgentName { get; set; }
    public DateTime ChangeValueTicketDate { get; set; }

    [CanBeNull]
    public string AmlAgentName { get; set; }

    [CanBeNull]
    public string AmlPreviousStatus { get; set; }

    public string AmlCurrentStatus { get; set; }

    [CanBeNull]
    public string Comments { get; set; }

    public DateTime? AmlDecisionDate { get; set; }

    public DecisionHistoryDetails GetData() => new DecisionHistoryDetails(
        isManualTicketLocking: IsManualTicketLocking,
        lockingReasonAml: LockingReasonAML,
        shopAgentName: ShopAgentName,
        changeValueTicketDate: ChangeValueTicketDate,
        amlAgentName: AmlAgentName,
        amlPreviousStatus: AmlPreviousStatus,
        amlCurrentStatus: AmlCurrentStatus,
        comments: Comments,
        amlDecisionDate: AmlDecisionDate);
}

internal sealed class LockingDetailDto : IPosApiResponse<LockingDetail>
{
    public string Status { get; set; }

    [CanBeNull]
    public string LockingReason { get; set; }

    public string LockingUser { get; set; }
    public DateTime LockingTime { get; set; }
    public bool ManualLock { get; set; }

    public LockingDetail GetData() => new LockingDetail(
        status: Status,
        lockingReason: LockingReason,
        lockingUser: LockingUser,
        lockingTime: LockingTime,
        manualLock: ManualLock);
}

internal sealed class UnlockingDetailDto : IPosApiResponse<UnlockingDetail>
{
    public string Status { get; set; }

    [CanBeNull]
    public string UnlockingReason { get; set; }

    public string UnlockingUser { get; set; }
    public DateTime UnlockingTime { get; set; }

    public UnlockingDetail GetData() => new UnlockingDetail(
        status: Status,
        unlockingReason: UnlockingReason,
        unlockingUser: UnlockingUser,
        unlockingTime: UnlockingTime);
}
