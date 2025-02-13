using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.BusinessLogic;
using Frontend.Gantry.Shared.Core.BusinessLogic.ContentServices;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using Frontend.Gantry.Shared.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace GFrontend.Gantry.Controllers
{
    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class GantryContentApiController : BaseApiController
    {
        private readonly ISiteCoreStaticPromotionService _siteCoreStaticPromotionService;
        private readonly IGantryCommonContentService _gantryCommonContentService;
        private readonly IGantryVirtualRaceSilksRunnerImageContentService _gantrySilkImagesContentService;
        private readonly IGantryMarketContentService _gantryMarketContentService;

        public GantryContentApiController(ISiteCoreStaticPromotionService siteCoreStaticPromotionService,
            IGantryCommonContentService gantryCommonContentService,
            IGantryVirtualRaceSilksRunnerImageContentService gantrySilkImagesContentService,
            IGantryMarketContentService gantryMarketContentService)
        {
            _siteCoreStaticPromotionService = siteCoreStaticPromotionService;
            _gantryCommonContentService = gantryCommonContentService;
            _gantrySilkImagesContentService = gantrySilkImagesContentService;
            _gantryMarketContentService = gantryMarketContentService;
        }

        [HttpGet("getStaticPromotionContent"), Produces(typeof(StaticPromotion))]
        public async Task<IActionResult> GetStaticPromotionContent(string itemIdOrPath)
        {
            return Ok(await _siteCoreStaticPromotionService.GetContent(itemIdOrPath));
        }

        [HttpGet("getGantryCommonContent")]
        public async Task<IActionResult> GetGantryCommonContent()
        {
            return Ok(await _gantryCommonContentService.GetContent());
        }

        [HttpGet("getVirtualRaceSilksRunnerImageContent")]
        public IActionResult GetVirtualRaceSilksRunnerImageContent(string meetingName, string eventType, string eventName)
        {
            return Ok(_gantrySilkImagesContentService.GetVirtualRaceSilkRunnerImages(meetingName, eventType, eventName));
        }

        [HttpGet("getMarkets"), ProducesResponseType(StatusCodes.Status200OK, Type = (typeof(List<Markets>)))]
        public IActionResult GetMarkets()
        {
            return new JsonResult(_gantryMarketContentService.getGantryMarkets());
        }
    }
}