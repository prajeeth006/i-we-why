using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.SegmentationGroups;

[Authorize]
[ApiController]
[Route("{culture}/api/[controller]")]
public class SegmentationGroupsController(
    IPosApiAccountService posApiAccountService,
    ILogger<SegmentationGroupsController> logger)
    : BaseController
{
    private readonly ILogger logger = logger;

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        try
        {
            var groups = await posApiAccountService.GetSegmentationGroupsAsync(cancellationToken);

            return Ok(new
            {
                groups,
            });
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling segmentation groups.");

            return BadRequest(sex.ErrorMessage());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling calling segmentation groups.");

            return BadRequest();
        }
    }
}
