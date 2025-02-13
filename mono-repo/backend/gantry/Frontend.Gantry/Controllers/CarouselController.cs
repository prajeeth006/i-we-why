using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.BusinessLogic.ContentServices;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Frontend.Gantry.CarouselControllers.Controllers
{

    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class CarouselController : BaseApiController
    {
        private readonly ICarouselService _carouselService;

        public CarouselController(ICarouselService carouselService)
        {
            _carouselService = carouselService;
        }


        [HttpGet("getCarouselUrls"), ProducesResponseType(StatusCodes.Status200OK, Type = (typeof(IList<CarouselUrl>)))]
        public async Task<IActionResult> getCarouselUrls(string targetrulesItemId)
        {
            return new JsonResult(await _carouselService.GetUrls(targetrulesItemId));
        }
    }
}