using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.BusinessLogic;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.Gantry.Controllers
{
    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class GantryEvrAvrConfigurationApiController : BaseApiController
    {
        private readonly IGantryEvrContentService _gantryEvrContentService;
        private readonly IGantryAvrConfigService _gantryAvrConfigService;
        public GantryEvrAvrConfigurationApiController(IGantryEvrContentService gantryEvrContentService, IGantryAvrConfigService gantryAvrConfigService)
        {
            _gantryEvrContentService = gantryEvrContentService;
            _gantryAvrConfigService = gantryAvrConfigService;
        }

        [HttpGet, Route("checkEvrAvrByTypeId")]
        public IActionResult CheckEvrAvrByTypeId(string typeId)
        {
            EvrAvrRace evrAvrRace = new EvrAvrRace();
            evrAvrRace.isEvrRace = _gantryEvrContentService.CheckEvrByTypeId(typeId);
            evrAvrRace.isAvrRace = _gantryAvrConfigService.CheckAvrByTypeId(typeId);
            return Ok(evrAvrRace);
        }

        [HttpGet, Route("getEvrOffPageDelay")]
        public IActionResult GetEvrOffPageDelay()
        {
            return Content(_gantryEvrContentService.GetEvrOffPageDelay().ToString());
        }
    }
}