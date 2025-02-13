using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.PlayerAttributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.PlayerAttributes;

[Authorize]
[Route("{culture}/api/[controller]")]
[ApiController]
public sealed class PlayerAttributesController : BaseController
{
    private readonly IPosApiCrmServiceInternal posApiCrmServiceInternal;
    private readonly ILogger logger;

    public PlayerAttributesController(IServiceProvider container, ILogger<PlayerAttributesController> log)
        : this(container.GetRequiredService<IPosApiCrmServiceInternal>(), log) { }

    internal PlayerAttributesController(IPosApiCrmServiceInternal posApiRetailServiceInternal, ILogger<PlayerAttributesController> logger)
    {
        posApiCrmServiceInternal = posApiRetailServiceInternal;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken, bool cached = true)
    {
        try
        {
            var mode = ExecutionMode.Async(cancellationToken);
            var result = await posApiCrmServiceInternal.GetPlayerAttributesAsync(mode, cached);

            return OkResult(result.Attributes);
        }
        catch (PosApiException sex)
        {
            // Newly registered users
            if (sex.PosApiCode == StatusCodes.Status101SwitchingProtocols)
            {
                return OkResult(new Attributes());
            }

            logger.LogError(sex, "Error from PosAPI while calling GetPlayerAttributes action");

            return BadRequest(sex.ErrorMessage()).WithTechnicalErrorMessage(sex.ErrorCode());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling GetPlayerAttributes action");

            return BadRequest().WithTechnicalErrorMessage(scope: "playerAttributes");
        }
    }
}
