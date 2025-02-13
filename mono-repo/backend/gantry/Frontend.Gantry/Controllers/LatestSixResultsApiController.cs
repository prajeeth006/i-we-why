using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.BusinessLogic;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Frontend.Gantry.Controllers
{

    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class LatestSixResultsApiController : BaseApiController
    {
        private readonly ILatestSixResultsContentService _latestSixResultsContentService;

        //public LatestSixResultsApiController() { }
        public LatestSixResultsApiController(ILatestSixResultsContentService latestSixResultsContentService)
        {
            _latestSixResultsContentService = latestSixResultsContentService;
        }

        [HttpGet("getLatestSixResultsContent")]
        
        public async Task<IActionResult> GetLatestSixResultsContent()
        {
            return Ok(await _latestSixResultsContentService.GetContent());
        }
    }
}