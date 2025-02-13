using System.Collections.Generic;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Frontend.Vanilla.Features.RtmsLayer;

public sealed class RtmsMessageRequest(
    string messageId,
    string templateId,
    string messageType,
    string campaignId,
    Dictionary<string, string> templateMetaData,
    string? source)
{
    public string MessageId { get; set; } = messageId;
    public string TemplateId { get; set; } = templateId;
    public string MessageType { get; set; } = messageType;
    public string CampaignId { get; set; } = campaignId;
    public Dictionary<string, string> TemplateMetaData { get; set; } = templateMetaData;
    public string? Source { get; set; } = source;
}
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
