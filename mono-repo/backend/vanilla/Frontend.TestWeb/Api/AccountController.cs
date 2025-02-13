using Frontend.Vanilla.Features.API;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.TestWeb.Api;

[Route("{culture}/playground/api/[controller]")]
public class AccountController : BaseController
{
    [HttpPost("topsecret")]
    public IActionResult TopSecret()
    {
        return Unauthorized();
    }
}
