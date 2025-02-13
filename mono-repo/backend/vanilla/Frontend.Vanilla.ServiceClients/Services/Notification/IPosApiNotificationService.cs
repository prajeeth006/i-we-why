using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Notification.EdsGroup;
using Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;
using Frontend.Vanilla.ServiceClients.Services.Notification.OfferStatuses;
using JetBrains.Annotations;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Notification;

/// <summary>
/// Represents Notification.svc PosAPI service.
/// </summary>
public interface IPosApiNotificationService
{
    [DelegateTo(typeof(IInboxMessageCountServiceClient), nameof(IInboxMessageCountServiceClient.GetAsync))]
    int GetInboxMessageCount(string status = null);

    [DelegateTo(typeof(IInboxMessageCountServiceClient), nameof(IInboxMessageCountServiceClient.GetAsync))]
    Task<int> GetInboxMessageCountAsync(string status, CancellationToken cancellationToken);

    [DelegateTo(typeof(IInboxMessagesServiceClient), nameof(IInboxMessagesServiceClient.GetAsync))]
    IReadOnlyList<InboxMessage> GetInboxMessages(InboxMessageFilter filter = null);

    [DelegateTo(typeof(IInboxMessagesServiceClient), nameof(IInboxMessagesServiceClient.GetAsync))]
    Task<IReadOnlyList<InboxMessage>> GetInboxMessagesAsync(InboxMessageFilter filter, CancellationToken cancellationToken);

    [DelegateTo(typeof(ISingleInboxMessageServiceClient), nameof(ISingleInboxMessageServiceClient.GetAsync))]
    InboxMessage GetSingleInboxMessage([NotNull] string messageId);

    [DelegateTo(typeof(ISingleInboxMessageServiceClient), nameof(ISingleInboxMessageServiceClient.GetAsync))]
    Task<InboxMessage> GetSingleInboxMessageAsync([NotNull] string messageId, CancellationToken cancellationToken);

    [DelegateTo(typeof(IInboxMessageStatusServiceClient), nameof(IInboxMessageStatusServiceClient.UpdateAsync))]
    void UpdateInboxMessageStatus([NotNull, ItemNotNull] IEnumerable<string> messageIds, [NotNull] string newStatus);

    [DelegateTo(typeof(IInboxMessageStatusServiceClient), nameof(IInboxMessageStatusServiceClient.UpdateAsync))]
    Task UpdateInboxMessageStatusAsync([NotNull, ItemNotNull] IEnumerable<string> messageIds, [NotNull] string newStatus, CancellationToken cancellationToken);

    [DelegateTo(typeof(IOfferStatusServiceClient), nameof(IOfferStatusServiceClient.GetAsync))]
    string GetOfferStatus([NotNull] string type, [NotNull] string id);

    [DelegateTo(typeof(IOfferStatusServiceClient), nameof(IOfferStatusServiceClient.GetAsync))]
    Task<string> GetOfferStatusAsync([NotNull] string type, [NotNull] string id, CancellationToken cancellationToken);

    [DelegateTo(typeof(IOfferStatusServiceClient), nameof(IOfferStatusServiceClient.PostAsync))]
    string UpdateOfferStatus([NotNull] string type, [NotNull] string id, bool optIn, string source = null);

    [DelegateTo(typeof(IOfferStatusServiceClient), nameof(IOfferStatusServiceClient.PostAsync))]
    Task<string> UpdateOfferStatusAsync([NotNull] string type, [NotNull] string id, bool optIn, CancellationToken cancellationToken, string source = null);

    [DelegateTo(typeof(IEdsGroupStatusServiceClient), nameof(IEdsGroupStatusServiceClient.GetAsync))]
    Task<EdsGroupStatus> GetEdsGroupStatusAsync(ExecutionMode mode, [NotNull] string groupId, bool cached = true);

    [DelegateTo(typeof(IEdsGroupStatusServiceClient), nameof(IEdsGroupStatusServiceClient.PostAsync))]
    Task<EdsGroupOptIn> UpdateEdsGroupStatusAsync(ExecutionMode mode, EdsGroupOptInRequest request);
}

internal interface IPosApiNotificationServiceInternal : IPosApiNotificationService
{
    [DelegateTo(typeof(IOfferStatusServiceClient), nameof(IOfferStatusServiceClient.GetAsync))]
    Task<string> GetOfferStatusAsync(ExecutionMode mode, [NotNull] string type, [NotNull] string id);
}
