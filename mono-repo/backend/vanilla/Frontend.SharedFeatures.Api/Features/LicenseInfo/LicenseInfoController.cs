using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.LicenseInfo;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.LicenseInfo;

[ApiController]
[Route("{culture}/api/[controller]")]
public class LicenseInfoController : BaseController
{
    private readonly ILicenseInfoServiceInternal licenseInfoService;
    private readonly ILogger logger;

    public LicenseInfoController(IServiceProvider provider, ILogger<LicenseInfoController> log)
        : this(provider.GetRequiredService<ILicenseInfoServiceInternal>(), log) { }

    internal LicenseInfoController(ILicenseInfoServiceInternal licenseInfoService, ILogger<LicenseInfoController> logger)
    {
        this.licenseInfoService = licenseInfoService;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        try
        {
            var mode = ExecutionMode.Async(cancellationToken);
            var licenseInfo = await licenseInfoService.GetLicenceComplianceAsync(mode);

            return Ok(new
            {
                acceptanceNeeded = licenseInfo.AcceptanceNeeded,
            });
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling Get LicenseInfo action");

            return BadRequest(sex.ErrorMessage());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling Get LicenseInfo action");

            return BadRequest();
        }
    }
}
