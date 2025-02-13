using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Login;

[AllowAnonymous]
[Route("{culture}/api/[controller]")]
public sealed class WorkflowDataController : BaseController
{
    private readonly ILogger log;
    private readonly IPosApiAuthenticationServiceInternal authService;

    public WorkflowDataController(ILogger<WorkflowDataController> log, IServiceProvider container)
        : this(log, container.GetRequiredService<IPosApiAuthenticationServiceInternal>()) { }

    internal WorkflowDataController(ILogger<WorkflowDataController> log, IPosApiAuthenticationServiceInternal authService)
    {
        this.authService = authService;
        this.log = log;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] IList<KeyValuePair<string, string>> data, CancellationToken cancellationToken)
    {
        try
        {
            await authService.AddWorkflowDataAsync(data.ToDictionary(), cancellationToken);

            return Ok();
        }
        catch (Exception ex)
        {
            log.LogError(ex, "AddWorkflowData failed");

            return BadRequest().WithTechnicalErrorMessage();
        }
    }
}
