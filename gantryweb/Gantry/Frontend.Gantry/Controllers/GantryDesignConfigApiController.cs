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
    public class GantryDesignConfigApiController : BaseApiController
    {
        private readonly IGantryDesignConfiguration _gantryDesignConfig;

        public GantryDesignConfigApiController(IGantryDesignConfiguration gantryDesignConfig)
        {
            _gantryDesignConfig = gantryDesignConfig;
        }

        [HttpGet("getDesignConfiguration")]
        public IActionResult GetDesignConfiguration()
        {
            return Ok(_gantryDesignConfig);
        }
    }
}
