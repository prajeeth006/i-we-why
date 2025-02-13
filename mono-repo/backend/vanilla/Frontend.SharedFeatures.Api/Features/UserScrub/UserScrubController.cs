using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.UserScrub;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.UserScrub;

[ApiController]
[Route("{culture}/api/[controller]")]
public class UserScrubController : BaseController
{
    private readonly IUserScrubService userScrubService;

    public UserScrubController(IServiceProvider container)
        : this(container.GetRequiredService<IUserScrubService>()) { }

    internal UserScrubController(IUserScrubService userScrubService)
    {
        this.userScrubService = userScrubService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var products = await userScrubService.ScrubbedForAsync(ExecutionMode.Async(cancellationToken));

        return Ok(new { products });
    }
}
