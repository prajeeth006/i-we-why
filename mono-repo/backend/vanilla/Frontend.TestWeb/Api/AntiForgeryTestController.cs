using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.TestWeb.Api;

[Route("{culture}/playground/api/[controller]")]
public sealed class AntiForgeryTestController : BaseController
{
    [HttpPost("enforce")]
    public JsonResult Enforce()
    {
        return new JsonResult("Hello Vanilla from the WebAPI");
    }

    [HttpPost("bypass")]
    [BypassAntiForgeryToken]
    public JsonResult Bypass()
    {
        return new JsonResult("Anti-forgery validation bypassed");
    }
}
