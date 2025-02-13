using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using JetBrains.Annotations;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Crm.CampaignDatas;

internal sealed class CampaignData(
    string action = null,
    string campaign = null,
    string group = null,
    string templateId = null,
    IEnumerable<KeyValuePair<string, string>> rewardAttributes = null)
{
    [CanBeNull]
    public string Action { get; } = action;

    [CanBeNull]
    public string Campaign { get; } = campaign;

    [CanBeNull]
    public string Group { get; } = group;

    [CanBeNull]
    public string TemplateId { get; } = templateId;

    [NotNull]
    public IReadOnlyDictionary<string, string> RewardAttributes { get; } = rewardAttributes.NullToEmpty().ToDictionary().AsReadOnly();
}

internal sealed class CampaignDataResponse : List<CampaignData>, IPosApiResponse<IReadOnlyList<CampaignData>>
{
    public IReadOnlyList<CampaignData> GetData() => this;
}
