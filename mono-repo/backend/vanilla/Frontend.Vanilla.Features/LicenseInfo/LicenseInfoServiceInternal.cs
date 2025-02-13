using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;

namespace Frontend.Vanilla.Features.LicenseInfo;

internal interface ILicenseInfoServiceInternal
{
    Task<LicenseInfoModel> GetLicenceComplianceAsync(ExecutionMode mode);
}

internal sealed class LicenseInfoServiceInternal(
    ILicenseInfoConfiguration config,
    ILicenseInfoService licenseInfoService,
    IPosApiAccountService accountService,
    IAppDslProvider appDslProvider,
    ICurrentUserAccessor currentUserAccessor)
    : ILicenseInfoServiceInternal
{
    public async Task<LicenseInfoModel> GetLicenceComplianceAsync(ExecutionMode mode)
    {
        if (!config.IsEnabled || currentUserAccessor.User.Identity.IsNotLoggedIn()) return new LicenseInfoModel { AcceptanceNeeded = false };

        var availableLicences = licenseInfoService.GetAvailableLicences(appDslProvider.Product);

        if (availableLicences.Count == 0) return new LicenseInfoModel { AcceptanceNeeded = false };

        var notAcceptedLicences = (await accountService.GetProductLicenceInfosAsync(mode, true)).Where(l => !l.LicenseAccepted).Select(o => o.LicenseCode).ToList();
        var licencesToAccept = availableLicences.Intersect(notAcceptedLicences).ToList();

        return new LicenseInfoModel { AcceptanceNeeded = licencesToAccept.Count != 0, Licenses = licencesToAccept.Join(), RedirectUrl = config.Url };
    }
}
