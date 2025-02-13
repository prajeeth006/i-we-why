using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.SmartBanner;

[AllowAnonymous]
[Route("{culture}/api/[controller]")]
[ApiController]
public class SmartBannerController : BaseController
{
    private readonly IPosApiCommonServiceInternal posApiCommonService;
    private readonly IGeoIPDslProvider geoIpDslProvider;
    private readonly IDeviceDslProvider deviceDslProvider;
    private readonly ILogger log;

    public SmartBannerController(IServiceProvider c, ILogger<SmartBannerController> log)
        : this(c.GetRequiredService<IPosApiCommonServiceInternal>(), c.GetRequiredService<IGeoIPDslProvider>(), c.GetRequiredService<IDeviceDslProvider>(), log) { }

    internal SmartBannerController(
        IPosApiCommonServiceInternal posApiCommonService,
        IGeoIPDslProvider geoIpDslProvider,
        IDeviceDslProvider deviceDslProvider,
        ILogger<SmartBannerController> log)
    {
        this.posApiCommonService = posApiCommonService;
        this.geoIpDslProvider = geoIpDslProvider;
        this.log = log;
        this.deviceDslProvider = deviceDslProvider;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string appId, CancellationToken cancellationToken)
    {
        try
        {
            var platform = await deviceDslProvider.OSNameAsync(ExecutionMode.Async(cancellationToken));
            var country = geoIpDslProvider.GetCountry()?.Trim();
            var appStoreInfo = await posApiCommonService.GetApplicationInformationAsync(cancellationToken, platform, appId, country);

            return Ok(new { appStoreInfo?.Name, Rating = appStoreInfo?.AllRating });
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Service exception while getting application info and content");

            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
