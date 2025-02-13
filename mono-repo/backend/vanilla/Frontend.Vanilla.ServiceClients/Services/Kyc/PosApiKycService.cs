using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.ServiceClients.Services.Kyc;

internal sealed class PosApiKycService(IKycServiceClient kycServiceClient, ICurrentUserAccessor currentUserAccessor, ILogger<PosApiKycService> log)
    : IKycService
{
    public async Task<IKycStatus> GetKycStatusAsync(ExecutionMode mode, bool cached = true)
    {
        try
        {
            if (currentUserAccessor.User.Identity?.IsAuthenticated == true || currentUserAccessor.User.GetWorkflowTypeId() != 0)
            {
                return await kycServiceClient.GetKycStatusAsync(mode, cached);
            }

            return new PosApiKycStatus();
        }
        catch (PosApiException sex)
        {
            if (sex.PosApiCode != 901)
            {
                log.LogError(sex, "GetKycStatusAsync failed");
            }

            return new PosApiKycStatus
            {
                VerificationStatus = sex.PosApiCode == 901
                    ? KycVerificationStatus.Verified
                    : KycVerificationStatus.Unknown,
            };
        }
        catch (Exception ex)
        {
            log.LogError(ex, "GetKycStatusAsync general error");

            return new PosApiKycStatus
            {
                VerificationStatus = KycVerificationStatus.Unknown,
            };
        }
    }

    public async Task<IKycInfoForRibbon> GetKycInfoForRibbonAsync(ExecutionMode mode)
    {
        try
        {
            if (currentUserAccessor.User.Identity?.IsAuthenticated == true || currentUserAccessor.User.GetWorkflowTypeId() != 0)
            {
                return await kycServiceClient.GetKycInfoForRibbonAsync(mode);
            }

            return new PosApiKycInfoForRibbon();
        }
        catch (PosApiException sex)
        {
            if (sex.PosApiCode != 901)
            {
                log.LogError(sex, "GetKycStatusAsync failed");
            }

            return new PosApiKycInfoForRibbon();
        }
        catch (Exception ex)
        {
            log.LogError(ex, "GetKycStatusAsync general error");

            return new PosApiKycInfoForRibbon();
        }
    }
}
