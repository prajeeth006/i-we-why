using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.BusinessLogic;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Frontend.Gantry.Controllers
{

    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class HorseRacingApiController : BaseApiController
    {
        private readonly IHorseRacingContentService _horseRacingContentService;

        public HorseRacingApiController(IHorseRacingContentService horseRacingContentService)
        {
            _horseRacingContentService = horseRacingContentService;
        }

        [HttpGet("getHorseRacingContent")]
        public async Task<IActionResult> GetHorseRacingContent()
        {
            return Ok(await _horseRacingContentService.GetContent());
        }
    }
}