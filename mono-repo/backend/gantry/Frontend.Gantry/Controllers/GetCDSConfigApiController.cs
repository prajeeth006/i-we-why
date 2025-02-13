using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Middlewares;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Frontend.Gantry.Controllers
{
    public class GetCDSConfigApiController : BaseApiController
    {
        private readonly ICDSConfig _contentDeliveryConfig;
        private readonly ICDSPushConnectionConfig _cdsPushConnectionConfig;

        public GetCDSConfigApiController(ICDSConfig contentDeliveryConfig, ICDSPushConnectionConfig cdsPushConnectionConfig)
        {
            _contentDeliveryConfig = contentDeliveryConfig;
            _cdsPushConnectionConfig = cdsPushConnectionConfig;
        }
        [HttpGet, Route("getCDSConfig")]
        public IActionResult GetCDSConfig()
        {
            return Ok(_contentDeliveryConfig);
        }

        [HttpGet, Route("getCDSPushConfig")]
        public IActionResult GetCDSPushConfig()
        {
            return Ok(_cdsPushConnectionConfig);
        }

    }
}
