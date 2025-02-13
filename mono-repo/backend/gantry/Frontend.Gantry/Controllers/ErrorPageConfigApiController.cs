using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.Gantry.Controllers
{

    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class GantryErrorPageConfigurationApiController : BaseApiController
    {
        private readonly IGantryErrorPageConfiguration _showDataFeedUrl;

        public GantryErrorPageConfigurationApiController(IGantryErrorPageConfiguration showDataFeedUrl)
        {
            _showDataFeedUrl = showDataFeedUrl;
        }

        [HttpGet("getErrorPageConfiguration")]
        public IGantryErrorPageConfiguration GetErrorPageConfiguration()
        {
            return _showDataFeedUrl;
        }
    }
}