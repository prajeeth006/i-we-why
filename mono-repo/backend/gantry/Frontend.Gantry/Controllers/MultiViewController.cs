using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.BusinessLogic.ContentServices;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Frontend.Gantry.Controllers
{

    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class MultiViewController : BaseApiController
    {
        private readonly IMultiViewService _multiViewService;

        public MultiViewController(IMultiViewService multiViewService)
        {
            _multiViewService = multiViewService;
        }


        [HttpGet("getMultiViewUrls"), ProducesResponseType(StatusCodes.Status200OK, Type = (typeof(IList<MultiViewUrl>)))]
        public async Task<IActionResult> GetMultiViewUrls(string targetrulesItemId)
        {
            return new JsonResult(await _multiViewService.GetUrls(targetrulesItemId));
        }
    }
}