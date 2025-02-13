using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.PlayerGamingDeclaration;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.PlayerGamingDeclaration;

// TODO: Add unit tests
[ApiController]
[Route("{culture}/api/gamingdeclaration")]
public sealed class PlayerGamingDeclarationController : BaseController
{
    private readonly ILogger<PlayerGamingDeclarationController> logger;
    private readonly IPosApiCrmServiceInternal posApiCrmService;

    public PlayerGamingDeclarationController(IServiceProvider container)
        : this(container.GetRequiredService<IPosApiCrmServiceInternal>(),
            container.GetRequiredService<ILogger<PlayerGamingDeclarationController>>()) { }

    internal PlayerGamingDeclarationController(
        IPosApiCrmServiceInternal posApiCrmService,
        ILogger<PlayerGamingDeclarationController> logger)
    {
        this.posApiCrmService = posApiCrmService;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var mode = ExecutionMode.Async(cancellationToken);

        try
        {
            var gamingDeclaration = await posApiCrmService.GetPlayerGamingDeclarationAsync(mode);

            return OkResult(gamingDeclaration);
        }
        catch (PosApiException ex)
        {
            logger.LogError(ex, "Error from PosAPI while getting Gaming Declaration");

            return BadRequest(ex.ErrorMessage()).WithErrorMessage(ex.PosApiMessage, scope: "gaming-declaration");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while getting Gaming Declaration");

            return BadRequest();
        }
    }

    [HttpPost("accept")]
    public async Task<IActionResult> Accept(GamingDeclarationRequest declarationRequest, CancellationToken cancellationToken)
    {
        try
        {
            await posApiCrmService.AcceptDeclarationAsync(declarationRequest, ExecutionMode.Async(cancellationToken));

            return Ok();
        }
        catch (PosApiException ex)
        {
            logger.LogError(ex, "Error from PosAPI while accepting Gaming Declaration");

            return BadRequest(ex.ErrorMessage()).WithErrorMessage(ex.PosApiMessage, scope: "gaming-declaration");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while accepting Gaming Declaration");

            return BadRequest();
        }
    }
}
