using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace Frontend.Gantry.Controllers
{
    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("api/gantry")]
    public class GantryClientLogController : BaseApiController
    {
        private readonly ILogger<GantryClientLogController> _logger;

        public GantryClientLogController(ILogger<GantryClientLogController> logger)
        {
            _logger = logger;
        }

        [HttpPost, Route("log")]
        public IActionResult Log([FromBody]Log log)
        {
            using (_logger.BeginScope(GetCustomLoggingProperties(log)))
            {
                _logger.Log(log.Level, log.Message);
            }
            return Ok();
        }

        private Dictionary<string, string> GetCustomLoggingProperties(Log log)
        {
            var customProperties = new Dictionary<string, string>();
            customProperties.Add("fatal", log.Fatal.ToString());
            customProperties.Add("status", log.Status);
            customProperties.Add("shopId", log.ShopId);
            customProperties.Add("screenId", log.ScreenId);
            customProperties.Add("stack", log.Stack);
            customProperties.Add("traceId", log.TraceId);
            customProperties.Add("timeStampFromFrontendInBtc", log.TimeStampFromFrontendInBtc);

            return customProperties;
        }
    }
}