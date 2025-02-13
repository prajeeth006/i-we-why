using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.Gantry.Controllers
{
    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class GetEventFeedApiController : BaseApiController
    {
        private readonly IEventFeedConfig _eventFeedConfig;

        public GetEventFeedApiController(IEventFeedConfig eventFeedConfig)
        {
            _eventFeedConfig = eventFeedConfig;
        }

        [HttpGet("getEventFeedApiUrls")]
        public IActionResult GetCarouselItems()
        {
            return Ok(_eventFeedConfig);
        }
    }
}