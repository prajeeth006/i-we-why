using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.ReCaptcha;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.ReCaptcha;

[AllowAnonymous]
[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class ReCaptchaController(IReCaptchaService service) : BaseController
{
    [HttpGet("enabled")]
    [BypassAntiForgeryToken]
    public async Task<IActionResult> GetEnabled([FromQuery] string area, CancellationToken cancellationToken)
    {
        var enabled = await service.IsEnabledAsync(area, cancellationToken);

        return Ok(new { enabled });
    }
}
