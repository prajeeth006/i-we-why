using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.AbuserInformation;

[AllowAnonymous]
[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class AbuserInformationController : BaseController
{
    private readonly IPosApiAccountServiceInternal accountService;
    private readonly ILogger logger;

    private static class ErrorCodes
    {
        public const int UserNotFound = 102;
    }

    public AbuserInformationController(IServiceProvider provider, ILogger<AbuserInformationController> log)
        : this(provider.GetRequiredService<IPosApiAccountServiceInternal>(), log) { }

    internal AbuserInformationController(IPosApiAccountServiceInternal accountService, ILogger<AbuserInformationController> logger)
    {
        this.accountService = accountService;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        try
        {
            var mode = ExecutionMode.Async(cancellationToken);
            var abuserInformation = await accountService.GetDnaAbuserInformationAsync(mode);

            return Ok(new
            {
                abuserInformation.IsBonusAbuser,
                abuserInformation.SportsBettingFactor,
                abuserInformation.ValueSegmentId,
            });
        }
        catch (PosApiException sex) when (sex.PosApiCode == ErrorCodes.UserNotFound)
        {
            logger.LogInformation(sex,
                "Error from PosAPI while calling Get AbuserInformation action with {PosApiCode} {PosApiMessage}",
                sex.PosApiCode,
                sex.PosApiMessage);

            return Ok(new { code = sex.ErrorCode(), message = sex.ErrorMessage() });
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling Get AbuserInformation action");

            return BadRequest(sex.ErrorMessage());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling Get AbuserInformation action");

            return BadRequest();
        }
    }
}
