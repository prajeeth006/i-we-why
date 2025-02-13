using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Features.API;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.TestWeb.Api;

[Route("{culture}/playground/api/[controller]")]
public class WrapperSettingsController(IServiceProvider serviceProvider) : BaseController
{
    private readonly IVanillaClientContentService clientContentService = serviceProvider.GetRequiredService<IVanillaClientContentService>();

    [HttpGet("getinitvalues")]
    public async Task<IActionResult> GetInitValues(CancellationToken cancellationToken)
    {
        var content = await clientContentService.GetAsync(PlaygroundPlugin.ContentRoot + "/WrapperSettings", cancellationToken);

        return Ok(new
        {
            Content = content,
        });
    }
}
