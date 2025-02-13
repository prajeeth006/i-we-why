using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Services.Crm2.Models;

namespace Frontend.Vanilla.ServiceClients.Services.Kyc.Models;

internal sealed class KycInfoForRibbon : IKycInfoForRibbon
{
    public string StatusCode { get; set; }

    public string StatusMessage { get; set; }

    public IReadOnlyList<KeyValue> AdditionalInfo { get; set; }
}
