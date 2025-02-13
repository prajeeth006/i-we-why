using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Features.API;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.TestWeb.Api;

[AllowAnonymous]
[Route("playground-api")]
public class DynaConOverridesModeController(IServiceProvider serviceProvider) : BaseController
{
    private readonly DynaConEngineSettings settings = serviceProvider.GetRequiredService<DynaConEngineSettings>();

    [HttpGet("dynacon-overrides-mode")]
    public JsonResult GetMode()
    {
        return new JsonResult(new { Mode = settings.LocalOverridesMode.ToString() });
    }
}
