using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.BusinessLogic;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Frontend.Gantry.Controllers
{

    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class CricketApiController : BaseApiController
    {
        private readonly ICricketContentService _cricketContentService;

        public CricketApiController(ICricketContentService cricketContentService)
        {
            _cricketContentService = cricketContentService;
        }


        [HttpGet("getCricketCountries"), ProducesResponseType(StatusCodes.Status200OK, Type = (typeof(IList<Countries>)))]
        public async Task<IActionResult> GetCricketCountries()
        {
            return new JsonResult(_cricketContentService.getCricketCountries());
        }
    }
}