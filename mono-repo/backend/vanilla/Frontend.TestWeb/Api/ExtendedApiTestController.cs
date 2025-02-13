using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.TestWeb.Api;

[Route("{culture}/playground/api/extended")]
public sealed class ExtendedApiTestController(IPosApiRestClient restClient) : BaseController
{
    [HttpGet("lastsession")]
    public async Task<IActionResult> ExtendedApiLastSession(CancellationToken cancellationToken)
    {
        var request = new ExtendedApiRestRequest(PosApiEndpoint.Authentication.LastSession);
        var response = await restClient.ExecuteAsync<object>(request, cancellationToken);

        return new OkObjectResult(response);
    }
}
