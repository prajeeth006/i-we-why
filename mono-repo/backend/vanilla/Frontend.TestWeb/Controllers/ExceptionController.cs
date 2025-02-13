using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.API;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.TestWeb.Controllers;

[AllowAnonymous]
public class ExceptionController : BaseController
{
    [HttpGet]
    [Route("{culture}/playground/exception/genericexception")]
    public Task<IActionResult> GenericException(CancellationToken cancellationToken)
    {
        var bytes = "Tests that response is correctly cleared before rendering custom error page.".EncodeToBytes();
        Response.Headers["X-Test"] = "Should be removed";
        ////await Response.Body.WriteAsync(bytes, 0, bytes.Length, cancellationToken);

        throw new Exception("This is generic test exception");
    }
}
