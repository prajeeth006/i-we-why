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
        private readonly IGreyHoundImagesContentService _greyHoundImagesContentService;

        public GreyHoundRacingApiController(IGreyHoundRacingContentService greyHoundRacingContentService, IGreyHoundImagesContentService greyHoundImagesContentService)
        {
            _greyHoundRacingContentService = greyHoundRacingContentService;
            _greyHoundImagesContentService = greyHoundImagesContentService;
        }

        [HttpGet("getGreyHoundRacingContent")]
        public async Task<IActionResult> GetGreyHoundRacingContent(string country, bool isSquareImage, bool is2XImage)
        {

            GreyHoundRacingContentDetails? data = await _greyHoundRacingContentService.GetContent();
            if (data != null)
            {
                data.GreyHoundImages = _greyHoundImagesContentService.GetImages(country, isSquareImage, is2XImage);
            }
            return Ok(data);
        }
    }
}