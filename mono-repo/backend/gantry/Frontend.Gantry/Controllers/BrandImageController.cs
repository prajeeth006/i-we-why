using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.Gantry.Controllers
{
    [AllowAnonymous]
    public class BrandImageController : Controller
    {
        private readonly IEnvironmentProvider _iEnvironmentProvider;
        public BrandImageController(IEnvironmentProvider iEnvironmentProvider)
        {
            _iEnvironmentProvider = iEnvironmentProvider;
        }
        public async Task<ActionResult> BrandImage()
        {
            ViewBag.domain = _iEnvironmentProvider?.CurrentLabel?.Value;
            @ViewBag.serverName = Environment.MachineName;
            return View("BrandImage");
        }
    }

}
