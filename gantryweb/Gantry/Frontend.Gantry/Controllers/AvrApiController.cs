using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.BusinessLogic;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.Gantry.Controllers
{

    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class AvrApiController : BaseApiController
    {
        private readonly IAvrContentService _avrContentService;

        public AvrApiController(IAvrContentService avrContentService)
        {
            _avrContentService = avrContentService;
        }

        [HttpGet("getAvrContent")]
        public async Task<IActionResult> GetAvrContent()
        {
            return Ok(await _avrContentService.GetContent());
        }

        [HttpGet("getAvrPageConfiguration")]
        public IActionResult GetAvrPageConfiguration(string controllerId) 
        {
            return Ok(_avrContentService.GetAvrPageTimingsBasedOnControllerId(controllerId));
        }
    }
}