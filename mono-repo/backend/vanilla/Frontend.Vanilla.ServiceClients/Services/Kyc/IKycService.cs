using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.ServiceClients.Services.Kyc;

internal interface IKycService
{
    Task<IKycStatus> GetKycStatusAsync(ExecutionMode mode, bool cached = true);

    Task<IKycInfoForRibbon> GetKycInfoForRibbonAsync(ExecutionMode mode);
}
