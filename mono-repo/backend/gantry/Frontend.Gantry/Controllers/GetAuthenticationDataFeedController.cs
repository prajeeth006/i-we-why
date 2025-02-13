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
    public class GetAuthenticationDataFeedController : BaseApiController
    {
        private readonly IAuthenticationDataFeedConfig _authenticationDataFeedConfig;

        public GetAuthenticationDataFeedController(IAuthenticationDataFeedConfig authenticationDataFeedConfig)
        {
            _authenticationDataFeedConfig = authenticationDataFeedConfig;
        }

        [HttpGet("getDataFeedAuthentication")]
        public IActionResult GetDataFeedAuthentication()
        {
            return Ok(_authenticationDataFeedConfig);
        }
    }
}
