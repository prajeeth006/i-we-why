using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.TestWeb.Tests.Multitenancy;

[Route("{culture}/playground/api/[controller]")]
public class MultitenancyTestController(IMultitenancyTestConfiguration config) : BaseController
{
    [BypassAntiForgeryToken]
    [HttpGet]
    public IActionResult Get()
        => Ok(new { config.Value });
}
