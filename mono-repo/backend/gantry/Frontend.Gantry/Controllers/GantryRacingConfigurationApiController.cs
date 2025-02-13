using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Frontend.Gantry.Controllers
{
    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class GantryRacingConfigurationApiController : BaseApiController
    {
        private readonly IGantryRacingConfiguration _gantryRacingConfig;

        public GantryRacingConfigurationApiController(IGantryRacingConfiguration gantryRacingConfig)
        {
            _gantryRacingConfig = gantryRacingConfig;
        }

        [HttpGet("getRacingConfiguration")]
        public IActionResult GetRacingConfiguration()
        {
            return Ok(_gantryRacingConfig);
        }
    }
}
