using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Services.Crm2.Models;

namespace Frontend.Vanilla.ServiceClients.Services.Kyc;

internal interface IKycInfoForRibbon
{
    string StatusCode { get; set; }

    string StatusMessage { get; set; }

    IReadOnlyList<KeyValue> AdditionalInfo { get; }
}
