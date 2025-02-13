using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Middlewares;
//using Frontend.Vanilla.DotNetCore.Base;
using Frontend.Vanilla.Features.API;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.Gantry.Host.Controllers
{
    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    [GantryApiAuthenticationFilter]
    public class BaseApiController : BaseController
    {
        public BaseApiController()
        
        {
        }
    }
}

