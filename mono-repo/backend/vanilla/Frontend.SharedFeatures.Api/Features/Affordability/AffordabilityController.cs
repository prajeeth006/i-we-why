using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Affordability;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Affordability;

[ApiController]
[Route("{culture}/api/[controller]")]
public class AffordabilityController : BaseController
{
    private readonly IAffordabilityConfiguration affordabilityConfiguration;
    private readonly IPosApiResponsibleGamingServiceInternal responsibleGamingServiceInternal;
    private readonly ILogger logger;

    public AffordabilityController(IServiceProvider provider, ILogger<AffordabilityController> logger)
        : this(
            provider.GetRequiredService<IAffordabilityConfiguration>(),
            provider.GetRequiredService<IPosApiResponsibleGamingServiceInternal>(),
            logger) { }

    internal AffordabilityController(
        IAffordabilityConfiguration affordabilityConfiguration,
        IPosApiResponsibleGamingServiceInternal responsibleGamingServiceInternal,
        ILogger<AffordabilityController> logger)
    {
        this.affordabilityConfiguration = affordabilityConfiguration;
        this.responsibleGamingServiceInternal = responsibleGamingServiceInternal;
        this.logger = logger;
    }

    [HttpPost("snapshotdetails")]
    public async Task<IActionResult> SnapshotDetails(CancellationToken cancellationToken)
    {
        try
        {
            var mode = ExecutionMode.Async(cancellationToken);
            var isEnabled = await affordabilityConfiguration.IsEnabledCondition.EvaluateAsync(mode);

            if (!isEnabled)
            {
                return Ok(new { isEnabled });
            }

            var snapshotDetails = await responsibleGamingServiceInternal.GetAffordabilitySnapshotDetailsAsync(cancellationToken);

            return Ok(new
            {
                snapshotDetails.AffordabilityStatus,
                snapshotDetails.EmploymentGroup,
            });
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling get affordability");

            return BadRequest(sex.ErrorMessage());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling get affordability");

            return BadRequest();
        }
    }
}
