using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.UserFlags;

[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class UserFlagsController : BaseController
{
    private readonly IPosApiCrmServiceInternal crmService;
    private readonly ILogger logger;

    public UserFlagsController(IServiceProvider provider, ILogger<UserFlagsController> log)
        : this(provider.GetRequiredService<IPosApiCrmServiceInternal>(), log) { }

    internal UserFlagsController(IPosApiCrmServiceInternal crmService, ILogger<UserFlagsController> logger)
    {
        this.crmService = crmService;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken, bool cached = true)
    {
        try
        {
            var userFlags = await crmService.GetUserFlagsAsync(cancellationToken, cached);

            return Ok(new
            {
                userFlags,
            });
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling Get (user flags) action");

            return BadRequest(sex.ErrorMessage()).WithTechnicalErrorMessage(sex.ErrorCode());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling Get (user flags) action");

            return BadRequest().WithTechnicalErrorMessage(scope: "get");
        }
    }

    [HttpGet("invalidatecache")]
    public IActionResult InvalidateCache()
    {
        try
        {
            crmService.InvalidateCached();

            return Ok();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling InvalidateCache action");

            return BadRequest().WithTechnicalErrorMessage(scope: "get");
        }
    }
}
