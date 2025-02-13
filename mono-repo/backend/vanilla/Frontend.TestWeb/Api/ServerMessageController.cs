using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.Features.Messages;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.TestWeb.Api;

[Route("{culture}/playground/api/[controller]")]
public class ServerMessagesController : BaseController
{
    [HttpGet("success")]
    public IActionResult Success()
    {
        return Ok().WithSuccessMessage("Success from server");
    }

    [HttpGet("400")]
    public IActionResult Error()
    {
        return BadRequest("bad").WithErrorMessage("Error from server").WithKeyValue("errorCode", "123");
    }

    [HttpGet("500")]
    public IActionResult InternalError()
    {
        return Problem("Exception msg")
            .WithErrorMessage("InternalError TempData from server", ApiMessageLifetime.TempData)
            .WithErrorMessage("InternalError from server")
            .WithKeyValue("errorCode", "456");
    }
}
