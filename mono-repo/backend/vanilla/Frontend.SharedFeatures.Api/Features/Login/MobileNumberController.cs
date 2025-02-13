using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Login;

[Route("{culture}/api/[controller]")]
[ApiController]
public class MobileNumberController : BaseController
{
    private readonly IPosApiCommonService posApiCommonService;
    private readonly ILogger<MobileNumberController> logger;

    public MobileNumberController(IServiceProvider c, ILogger<MobileNumberController> logger)
        : this(c.GetRequiredService<IPosApiCommonService>(), logger) { }

    internal MobileNumberController(IPosApiCommonService posApiCommonService, ILogger<MobileNumberController> logger)
    {
        this.posApiCommonService = posApiCommonService;
        this.logger = logger;
    }

    [HttpGet("countries")]
    public async Task<IActionResult> GetCountries(CancellationToken cancellationToken)
    {
        try
        {
            var countries = await posApiCommonService.GetAllCountriesAsync(cancellationToken);

            return Ok(new { countries = countries.Select(x => new { x.Predial, x.Id }) });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to load countries");

            return BadRequest();
        }
    }
}
