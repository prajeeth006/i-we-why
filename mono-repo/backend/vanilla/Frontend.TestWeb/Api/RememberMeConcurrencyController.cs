using Frontend.Vanilla.Features.API;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.TestWeb.Api;

[Route("{culture}/playground/api/remember-me-concurrency-test")]
public class RememberMeConcurrencyController : BaseController
{
    private static int counter = 0;

    [HttpGet]
    public IActionResult Get()
    {
        return counter++ / 2 % 2 == 0
            ? Unauthorized()
            : Ok();
    }

    [HttpGet("reset")]
    public IActionResult GetClear()
    {
        counter = 0;

        return Ok();
    }
}
