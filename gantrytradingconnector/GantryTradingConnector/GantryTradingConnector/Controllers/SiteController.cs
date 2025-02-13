using GantryTradingConnector.Shared.Business;
using Microsoft.AspNetCore.Mvc;

namespace GantryTradingConnector.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SiteController : ControllerBase
    {
        private readonly IVersionProviderBusiness _versionProviderBusiness;

        public SiteController(IVersionProviderBusiness versionProviderBusiness)
        {
            _versionProviderBusiness = versionProviderBusiness;
        }

        [HttpGet]
        [Route("version")]
        public async Task<IActionResult> Version()
        {
            var response = await _versionProviderBusiness.GetVersionDetail();

            return Ok(response);
        }
    }
}
