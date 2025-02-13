using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.LicenseInfo;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class LicenseInfoDslProvider(ILicenseInfoServiceInternal licenseInfoService) : ILicenseInfoDslProvider
{
    public async Task<bool> GetAcceptanceNeededAsync(ExecutionMode mode)
    {
        var licenseInfo = await licenseInfoService.GetLicenceComplianceAsync(mode);

        return licenseInfo.AcceptanceNeeded;
    }
}
