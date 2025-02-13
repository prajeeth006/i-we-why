using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.BusinessLogic.ContentServices;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Frontend.Gantry.Controllers
{

    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class BrandImageApiController : BaseApiController
    {
        private readonly IBrandImageService _brandImageService;

        public BrandImageApiController(IBrandImageService brandImageService)
        {
            _brandImageService = brandImageService;
        }

        [HttpGet("getBrandImage")]
        public async Task<IActionResult> GetBrandImage(string path)
        {
            return Ok(await _brandImageService.GetBrandImage(path));
        }
    }
}