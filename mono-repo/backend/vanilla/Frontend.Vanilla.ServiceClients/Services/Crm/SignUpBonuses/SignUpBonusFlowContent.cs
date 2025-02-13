using System.Collections.Generic;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.SignUpBonuses;

internal sealed class CampaignFlowDetails
{
    public IReadOnlyList<string> BonusDetails { get; }
    public string CampaignType { get; }
    public int NumberOfBonuses { get; }
}

internal sealed class SignUpBonusFlowContent
{
    public int? TrackerId { get; set; }
    public int BonusId { get; set; }
    public CampaignFlowDetails CampaignFlowDetails { get; }
}
