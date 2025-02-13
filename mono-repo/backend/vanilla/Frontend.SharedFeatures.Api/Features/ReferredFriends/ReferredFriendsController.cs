using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.ReferredFriends;

[Authorize]
[Route("{culture}/api/[controller]")]
[ApiController]
public sealed class ReferredFriendsController : BaseController
{
    private readonly IPosApiCrmServiceInternal posApiCrmServiceInternal;
    private readonly ILogger logger;

    public ReferredFriendsController(IServiceProvider container, ILogger<ReferredFriendsController> log)
        : this(container.GetRequiredService<IPosApiCrmServiceInternal>(), log) { }

    internal ReferredFriendsController(IPosApiCrmServiceInternal posApiRetailServiceInternal, ILogger<ReferredFriendsController> logger)
    {
        posApiCrmServiceInternal = posApiRetailServiceInternal;
        this.logger = logger;
    }

    [HttpGet("invitationUrl")]
    public async Task<IActionResult> GetInvitationUrl(CancellationToken cancellationToken)
    {
        try
        {
            var mode = ExecutionMode.Async(cancellationToken);
            var result = await posApiCrmServiceInternal.GetInvitationUrlAsync(mode);

            return OkResult(result);
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling GetInvitationUrl action");

            return BadRequest(sex.ErrorMessage()).WithTechnicalErrorMessage(sex.ErrorCode());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling GetInvitationUrl action");

            return BadRequest().WithTechnicalErrorMessage(scope: "invitationUrl");
        }
    }
}
