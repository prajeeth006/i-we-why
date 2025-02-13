using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;

public sealed class InboxMessage(
    string id = null,
    UtcDateTime createdDate = default,
    IEnumerable<string> eligibleProducts = null,
    string messageSource = null,
    string messageStatus = null,
    string messageType = null,
    int priority = default,
    string sourceStatus = null,
    string templateId = null,
    IEnumerable<KeyValuePair<string, string>> templateMetaData = null,
    IEnumerable<KeyValuePair<string, string>> campaignMetaData = null)
{
    public string Id { get; } = id;
    public UtcDateTime CreatedDate { get; } = createdDate;
    public IReadOnlyList<string> EligibleProducts { get; } = eligibleProducts?.ToList();
    public string MessageSource { get; } = messageSource;
    public string MessageStatus { get; } = messageStatus;
    public string MessageType { get; } = messageType;
    public int Priority { get; } = priority;
    public string SourceStatus { get; } = sourceStatus;
    public string TemplateId { get; } = templateId;
    public IReadOnlyDictionary<string, string> TemplateMetaData { get; } = templateMetaData?.ToDictionary();
    public IReadOnlyDictionary<string, string> CampaignMetaData { get; } = campaignMetaData?.ToDictionary();
}

internal sealed class InboxMessagesResponse : IPosApiResponse<IReadOnlyList<InboxMessage>>
{
    public IReadOnlyList<InboxMessage> MessageDetails { get; set; }
    public IReadOnlyList<InboxMessage> GetData() => MessageDetails.NullToEmpty();
}
