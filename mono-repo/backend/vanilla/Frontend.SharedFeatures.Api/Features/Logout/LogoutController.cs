using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Features;
using Frontend.Vanilla.Features.API;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Logout;

[Route("{culture}/api/[controller]")]
[ApiController]
public sealed class LogoutController : BaseController
{
    private readonly IVanillaClientContentService clientContentService;

    public LogoutController(IServiceProvider container)
        : this(container.GetRequiredService<IVanillaClientContentService>()) { }

    internal LogoutController(IVanillaClientContentService clientContentService)
    {
        this.clientContentService = clientContentService;
    }

    [HttpGet("initdata")]
    public async Task<IActionResult> GetInitData(CancellationToken cancellationToken)
    {
        return Ok(
            new
            {
                Content = await clientContentService.GetAsync(AppPlugin.ContentRoot + "/Logout/Logout", cancellationToken),
            });
    }
}
