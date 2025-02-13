using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.BusinessLogic;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Frontend.Gantry.Controllers
{
    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class GetSportContentByItemPathController : BaseApiController
    {
        private readonly ISportContentByItemPathService _sportContentByItemPathService;

        public GetSportContentByItemPathController(ISportContentByItemPathService sportContentByItemPathService)
        {
            _sportContentByItemPathService = sportContentByItemPathService;
        }

        [HttpGet("getSportContentByItemPath")]
        public async Task<IActionResult> GetSportContentByItemPath(string itemPath)
        {
            return Ok(await _sportContentByItemPathService.GetContent(itemPath));
        }
    }
}
