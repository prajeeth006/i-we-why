using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.BusinessLogic;
using Frontend.Gantry.Shared.Core.BusinessLogic.ContentServices;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Frontend.Gantry.Controllers
{

    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class GreyHoundRacingApiController : BaseApiController
    {
        private readonly IGreyHoundRacingContentService _greyHoundRacingContentService;

        public GreyHoundRacingApiController(IGreyHoundRacingContentService greyHoundRacingContentService)
        {
            _greyHoundRacingContentService = greyHoundRacingContentService;
        }

        [HttpGet("getGreyHoundRacingContent")]
        public async Task<IActionResult> GetGreyHoundRacingContent()
        {

            GreyHoundRacingContentDetails? data = await _greyHoundRacingContentService.GetContent();
            return Ok(data);
        }
    }
}