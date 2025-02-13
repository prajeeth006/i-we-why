using System;
using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Notification.EdsGroup;

public sealed class EdsGroupStatus(IEnumerable<CampaignDetails> campaignDetails, IReadOnlyDictionary<string, string> groupOptinStatusParameters)
{
    public IEnumerable<CampaignDetails> CampaignDetails { get; } = campaignDetails;
    public IReadOnlyDictionary<string, string> GroupOptinStatusParameters { get; } = groupOptinStatusParameters;
}

public sealed class CampaignDetails(long id, string name, string optInStatus, DateTime? optInDate)
{
    public long Id { get; } = id;

    public string Name { get; } = name;

    public string OptInStatus { get; } = optInStatus;

    public DateTime? OptInDate { get; } = optInDate;
}

internal sealed class EdsGroupStatusResponse : IPosApiResponse<EdsGroupStatus>
{
    public IEnumerable<CampaignDetails> CampaignDetails { get; set; }
    public IReadOnlyDictionary<string, string> GroupOptinStatusParameters { get; set; }
    public EdsGroupStatus GetData() => new EdsGroupStatus(CampaignDetails, GroupOptinStatusParameters);
}
