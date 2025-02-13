using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.SofStatus;

[Authorize]
[ApiController]
[Route("{culture}/api/[controller]")]
public class SofStatusDetailsController : BaseController
{
    private readonly IPosApiAccountServiceInternal accountService;
    private readonly ILogger logger;

    public SofStatusDetailsController(IServiceProvider container, ILogger<SofStatusDetailsController> logger)
        : this(container.GetRequiredService<IPosApiAccountServiceInternal>(), logger) { }

    internal SofStatusDetailsController(IPosApiAccountServiceInternal accountService, ILogger<SofStatusDetailsController> logger)
    {
        this.accountService = accountService;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken, bool cached = true)
    {
        try
        {
            var mode = ExecutionMode.Async(cancellationToken);

            var sofStatusDetails = await accountService.GetSofStatusDetailsAsync(mode, cached);

            return OkResult(sofStatusDetails);
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling Get SofStatusDetails action");

            return BadRequest(sex.ErrorMessage());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling Get SofStatusDetails action");

            return BadRequest();
        }
    }
}
