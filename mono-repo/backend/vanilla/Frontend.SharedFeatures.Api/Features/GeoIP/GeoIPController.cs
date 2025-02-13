using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.API;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.GeoIP;

[ApiController]
[Route("{culture}/api/[controller]")]
public class GeoIpController(IGeoIPDslProvider geoIpDslProvider, ILogger<GeoIpController> logger) : BaseController
{
    private readonly ILogger logger = logger;

    [HttpGet]
    public IActionResult Get()
    {
        try
        {
            var result = geoIpDslProvider.GetCountryName();

            return Ok(new
            {
                countryName = result,
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling Get GeoIP action");

            return BadRequest();
        }
    }
}
