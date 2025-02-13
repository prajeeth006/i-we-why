using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Services.Crm2.Models;

namespace Frontend.Vanilla.ServiceClients.Services.Kyc;

internal sealed class PosApiKycInfoForRibbon : IKycInfoForRibbon
{
    public string StatusCode { get; set; }

    public string StatusMessage { get; set; }

    public IReadOnlyList<KeyValue> AdditionalInfo { get; set; }

    public PosApiKycInfoForRibbon()
    {
        StatusCode = "Unknown";
        StatusMessage = "Unknown";
        AdditionalInfo = new List<KeyValue>();
    }
}
