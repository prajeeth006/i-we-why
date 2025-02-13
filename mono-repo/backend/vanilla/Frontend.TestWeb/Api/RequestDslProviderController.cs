using Frontend.TestWeb.Features;
using Frontend.Vanilla.Features.API;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.TestWeb.Api;

[Route("{culture}/playground/api/[controller]")]
public class RequestDslProviderController(RequestDslProviderTestData testData) : BaseController
{
    [HttpGet]
    public IActionResult Get()
        => Ok(testData);
}
