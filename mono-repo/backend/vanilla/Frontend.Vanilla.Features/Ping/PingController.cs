using Frontend.Vanilla.Features.API;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.Vanilla.Features.Ping;

/// <summary>Prolong the session.</summary>
[Authorize]
[Route("api/[controller]")]
[ApiController]
public sealed class PingController : BaseController
{
    /// <summary>Prolong the session.</summary>
    [HttpGet]
    public IActionResult Get()
        => Ok();
}
